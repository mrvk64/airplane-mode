// Airplane Mode: on-device AI replies. A small language model runs in the browser on the phone's GPU
// (WebLLM over WebGPU). It downloads once on wifi, the browser keeps it, and from then on it writes replies
// with no connection. The rules engine still decides who replies and how they feel; the model only writes
// the words, and every line keeps a pre-written fallback, so a slow or missing model never stalls the feed.
window.AM = window.AM || {};

(function () {
  // Pinned to 0.2.79 on purpose. From 0.2.80 the library picks each next word on the GPU, and on Qualcomm
  // Adreno phones (most Android phones) that step returns random words in every language: measured on a
  // Galaxy S24 Ultra on 2026-11-17, and see web-llm issue #836. 0.2.79 picks words on the CPU and writes real
  // sentences there. Check a newer version on an Adreno phone before moving this pin.
  const LIB = 'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.79/lib/index.js';
  const KEY = 'airplane-mode/ai';
  const MODELS = {
    standard: { label: 'Standard', size: '670 MB', f16: 'Llama-3.2-1B-Instruct-q4f16_1-MLC', f32: 'Llama-3.2-1B-Instruct-q4f32_1-MLC' },
    best: { label: 'Best', size: '1.7 GB', f16: 'Llama-3.2-3B-Instruct-q4f16_1-MLC', f32: 'Llama-3.2-3B-Instruct-q4f32_1-MLC' }
  };
  const TIMEOUT = 45000;
  // Each model has one big table of word meanings that the GPU has to reach in a single piece. Many phones cap
  // that at 128 MB: Standard's table (125 MB) fits, Best's (188 MB) does not and comes out as gibberish. So Best
  // is offered only where the cap is bigger.
  const BEST_NEEDS = 256 * 1024 * 1024;

  // bestOk: null until the GPU is checked, then whether this device can run Best.
  // garbled: set when a model failed its self-check on this device, so Settings can say so plainly.
  const AI = AM.AI = { state: 'off', progress: 0, detail: '', tier: null, model: null, bestOk: null, garbled: null, stats: { n: 0, ms: 0, out: 0, last: null }, MODELS };
  const listeners = new Set();
  let lib = null, engine = null, loading = null, busy = false, gpu = null, restarts = 0;
  const GPU_LOST = /disposed|instance|device|lost|gpu|operationerror|not loaded/i;
  // The browser can drop the GPU (switching apps, memory pressure). Reload the model from storage,
  // at most twice per session; after that, say so in Settings instead of retrying forever.
  function recover() {
    const old = engine;
    engine = null; loading = null;
    try { if (old) old.unload().catch(() => {}); } catch (e) { /* already gone */ }
    if (restarts >= 2) { set('error', 'The AI stopped working. Turn it off and on again.'); return; }
    restarts++;
    set('loading', 'Restarting the AI');
    setTimeout(() => AI.start(AI.tier).catch(() => {}), 1500);
  }
  const pending = [];

  // Phones dim and lock after a few seconds, and a locked phone pauses the download, so the screen stays on
  // while the model downloads and loads, and is let go the moment it is ready or fails.
  let wake = null, wantWake = false;
  async function holdScreen(on) {
    wantWake = on;
    try {
      if (on && !wake && navigator.wakeLock && document.visibilityState === 'visible') {
        const w = await navigator.wakeLock.request('screen');
        if (!wantWake) { w.release().catch(() => {}); return; }
        wake = w;
        w.addEventListener('release', () => { if (wake === w) wake = null; });
      } else if (!on && wake) {
        const w = wake; wake = null; await w.release();
      }
    } catch (e) { /* not allowed (battery saver, older browser): the "keep the app open" note still shows */ }
  }
  // The browser drops the lock whenever the app is hidden; take it again on the way back.
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => { if (wantWake && document.visibilityState === 'visible') holdScreen(true); });

  // The claude.ai viewer blocks the model download, so AI replies live in the installed app only.
  const loc = window.location || { hostname: '', protocol: '' };
  AI.inArtifact = !!window.claude || /claude\.ai$|claudeusercontent/.test(loc.hostname);
  AI.supported = () => typeof navigator !== 'undefined' && !!navigator.gpu && !AI.inArtifact && /^https?:$/.test(loc.protocol);
  AI.on = fn => { listeners.add(fn); return () => listeners.delete(fn); };
  const emit = () => listeners.forEach(fn => { try { fn(AI); } catch (e) { /* a listener failing must not stop the others */ } });
  const set = (state, detail) => { AI.state = state; if (detail != null) AI.detail = detail; emit(); };
  const saved = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } };
  const save = v => { try { if (v) localStorage.setItem(KEY, JSON.stringify(v)); else localStorage.removeItem(KEY); } catch (e) { /* kept in memory */ } };
  AI.installed = () => { const s = saved(); return s && s.model ? s : null; };

  async function gpuInfo() {
    if (gpu) return gpu;
    try {
      const ad = await navigator.gpu.requestAdapter();
      gpu = { f16: !!(ad && ad.features && ad.features.has('shader-f16')), bind: (ad && ad.limits && ad.limits.maxStorageBufferBindingSize) || 0 };
    } catch (e) { gpu = { f16: false, bind: 0 }; }
    return gpu;
  }
  // Settings calls this once to know whether to offer Best.
  AI.checkGpu = async function () {
    if (!AI.supported()) return false;
    const ok = (await gpuInfo()).bind >= BEST_NEEDS;
    if (AI.bestOk !== ok) { AI.bestOk = ok; emit(); }
    return ok;
  };
  async function loadLib() { if (!lib) lib = await import(LIB); return lib; }

  // Some graphics chips run the model but compute it wrong, and every reply comes out as random words. One
  // question with a known answer catches that before a garbled line can reach the feed. It also does the
  // slow first run (shader compile), so the first real reply is quick.
  async function selfCheck() {
    try {
      const r = await engine.chat.completions.create({ messages: [{ role: 'user', content: 'What is 2 plus 2? Answer with one word.' }], max_tokens: 8, temperature: 0.01 });
      const t = (r.choices && r.choices[0] && r.choices[0].message && r.choices[0].message.content) || '';
      return /\b(4|four)\b/i.test(t);
    } catch (e) { return false; }
  }

  // Downloads the model the first time, then loads it onto the GPU. Calling it again reuses the same work.
  // `modelOverride` is for testing with a smaller model.
  AI.start = function (tier, modelOverride) {
    if (loading) return loading;
    loading = (async () => {
      if (!AI.supported()) { set('unsupported', ''); throw new Error('unsupported'); }
      const s = saved();
      const g = await gpuInfo();
      AI.bestOk = g.bind >= BEST_NEEDS;
      tier = tier || (s && s.tier) || 'standard';
      // A phone that saved Best under 0.3.0 got gibberish from it; it moves to Standard (old files deleted below).
      if (tier === 'best' && !AI.bestOk && !modelOverride) tier = 'standard';
      const id = modelOverride || (s && s.tier === tier && s.model) || MODELS[tier][g.f16 ? 'f16' : 'f32'];
      AI.tier = tier;
      AI.garbled = null;
      set('loading', 'Getting ready');
      holdScreen(true);
      const L = await loadLib();
      const cached = await L.hasModelInCache(id).catch(() => false);
      set(cached ? 'loading' : 'downloading', cached ? 'Waking up the AI' : 'Starting download');
      if (!cached && navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
      engine = await L.CreateMLCEngine(id, {
        initProgressCallback: r => { AI.progress = r.progress || 0; AI.detail = r.text || ''; emit(); }
      });
      set('loading', 'Checking the AI');
      if (!(await selfCheck())) {
        // Garbled on this device: free the space and say so, rather than retrying forever.
        try { await engine.unload(); } catch (e) { /* already gone */ }
        engine = null;
        await L.deleteModelAllInfoInCache(id).catch(() => {});
        save(null);
        AI.garbled = tier;
        throw new Error(tier === 'best' ? 'Best gave garbled answers on this phone, so it was deleted. Try Standard.'
          : 'This phone\'s graphics chip garbled the AI\'s answers, so it was deleted and replies stay hand-written.');
      }
      AI.model = id;
      save({ tier, model: id });
      if (s && s.model && s.model !== id) L.deleteModelAllInfoInCache(s.model).catch(() => {});
      set('ready', '');
      holdScreen(false);
      pump();
      return engine;
    })().catch(err => {
      holdScreen(false);
      loading = null; engine = null;
      if (AI.state !== 'unsupported') set('error', String((err && err.message) || err).slice(0, 160));
      throw err;
    });
    return loading;
  };

  // Writes one reply. Jobs run one at a time, most urgent first (a DM the player is waiting on beats a
  // reply to an old post), and each has a deadline.
  AI.write = function (messages, opts) {
    opts = opts || {};
    return new Promise((resolve, reject) => {
      pending.push({ messages, opts, resolve, reject, prio: opts.priority || 1, at: Date.now() });
      pump();
    });
  };
  async function pump() {
    if (busy || AI.state !== 'ready' || !engine || !pending.length) return;
    pending.sort((a, b) => b.prio - a.prio || a.at - b.at);
    const job = pending.shift();
    if (job.opts.stale && job.opts.stale()) { job.reject(new Error('stale')); setTimeout(pump, 0); return; }
    busy = true;
    let timer = 0;
    try {
      const t0 = performance.now();
      const run = engine.chat.completions.create({ messages: job.messages, max_tokens: job.opts.max || 70,
        temperature: job.opts.temp || 0.9, top_p: 0.95, frequency_penalty: 0.4 });
      const timeout = new Promise((_, rej) => { timer = setTimeout(() => { try { engine.interruptGenerate(); } catch (e) { /* already done */ } rej(new Error('timeout')); }, TIMEOUT); });
      const res = await Promise.race([run, timeout]);
      const ms = performance.now() - t0, u = res.usage || {};
      AI.stats.n++; AI.stats.ms += ms; AI.stats.out += u.completion_tokens || 0;
      AI.stats.last = { ms: Math.round(ms), prompt: u.prompt_tokens || 0, out: u.completion_tokens || 0 };
      emit();
      job.resolve(((res.choices && res.choices[0] && res.choices[0].message && res.choices[0].message.content) || '').trim());
    } catch (err) {
      job.reject(err);
      if (GPU_LOST.test(String((err && (err.message || err)) || ''))) recover();
    } finally {
      clearTimeout(timer);
      busy = false;
      if (pending.length) setTimeout(pump, 0);
    }
  }
  AI.queued = () => pending.length + (busy ? 1 : 0);
  AI.debugDrop = async () => { try { if (engine) await engine.unload(); } catch (e) { /* fine */ } };

  // Turns AI replies off and deletes the downloaded model from the phone.
  AI.remove = async function () {
    const s = saved();
    pending.splice(0).forEach(j => j.reject(new Error('removed')));
    holdScreen(false);
    try { if (engine) await engine.unload(); } catch (e) { /* nothing loaded */ }
    engine = null; loading = null;
    if (s && s.model) { try { const L = await loadLib(); await L.deleteModelAllInfoInCache(s.model); } catch (e) { /* already gone */ } }
    save(null);
    AI.tier = null; AI.model = null; AI.progress = 0;
    set('off', '');
  };

  // On launch, wake the model back up if the player turned AI replies on before.
  AI.resume = function () { if (AI.installed() && AI.supported() && !loading) AI.start().catch(() => {}); };
})();
