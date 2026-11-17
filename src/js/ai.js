// Airplane Mode: on-device AI replies. A small language model runs in the browser on the phone's GPU
// (WebLLM over WebGPU). It downloads once on wifi, the browser keeps it, and from then on it writes replies
// with no connection. The rules engine still decides who replies and how they feel; the model only writes
// the words, and every line keeps a pre-written fallback, so a slow or missing model never stalls the feed.
window.AM = window.AM || {};

(function () {
  const LIB = 'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.87/lib/index.js';
  const KEY = 'airplane-mode/ai';
  const MODELS = {
    standard: { label: 'Standard', size: '670 MB', f16: 'Llama-3.2-1B-Instruct-q4f16_1-MLC', f32: 'Llama-3.2-1B-Instruct-q4f32_1-MLC' },
    best: { label: 'Best', size: '1.7 GB', f16: 'Llama-3.2-3B-Instruct-q4f16_1-MLC', f32: 'Llama-3.2-3B-Instruct-q4f32_1-MLC' }
  };
  const TIMEOUT = 45000;

  const AI = AM.AI = { state: 'off', progress: 0, detail: '', tier: null, model: null, stats: { n: 0, ms: 0, out: 0, last: null }, MODELS };
  const listeners = new Set();
  let lib = null, engine = null, loading = null, busy = false, f16 = null, restarts = 0;
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

  async function hasF16() {
    if (f16 !== null) return f16;
    try { const ad = await navigator.gpu.requestAdapter(); f16 = !!(ad && ad.features && ad.features.has('shader-f16')); } catch (e) { f16 = false; }
    return f16;
  }
  async function loadLib() { if (!lib) lib = await import(LIB); return lib; }

  // Downloads the model the first time, then loads it onto the GPU. Calling it again reuses the same work.
  // `modelOverride` is for testing with a smaller model.
  AI.start = function (tier, modelOverride) {
    if (loading) return loading;
    loading = (async () => {
      if (!AI.supported()) { set('unsupported', ''); throw new Error('unsupported'); }
      const s = saved();
      tier = tier || (s && s.tier) || 'standard';
      const id = modelOverride || (s && s.tier === tier && s.model) || MODELS[tier][(await hasF16()) ? 'f16' : 'f32'];
      AI.tier = tier;
      set('loading', 'Getting ready');
      const L = await loadLib();
      const cached = await L.hasModelInCache(id).catch(() => false);
      set(cached ? 'loading' : 'downloading', cached ? 'Waking up the AI' : 'Starting download');
      if (!cached && navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
      engine = await L.CreateMLCEngine(id, {
        initProgressCallback: r => { AI.progress = r.progress || 0; AI.detail = r.text || ''; emit(); }
      });
      AI.model = id;
      save({ tier, model: id });
      set('loading', 'Warming up');
      try { await engine.chat.completions.create({ messages: [{ role: 'user', content: 'Say hi.' }], max_tokens: 2 }); } catch (e) { /* the real replies will try again */ }
      set('ready', '');
      pump();
      return engine;
    })().catch(err => {
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
