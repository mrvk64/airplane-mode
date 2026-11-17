// Airplane Mode: the world engine (flight clock, story, reactions) and the app UI.
// Everything runs on this device. Time is real: the story is paced to the flight length the player
// picks, and if the phone sleeps the world catches up from timestamps when it wakes.
(function () {
  'use strict';

  const APP_VERSION = '0.3.0';
  const MIN = 60000;
  const KEY = 'airplane-mode/v1';

  // ---------- worlds ----------
  // Harbor City (grown-ups) and Treetop Town (kids) share this engine; everything world-specific is
  // read through these variables, which useWorld() points at the active world.
  let W, C, R, FEED, ST, CAST, SUSPECTS, NO_REPLY, ROLE, SIG, TOPICS, T;
  function useWorld(kind) {
    const kids = kind === 'kids' && !!AM.KIDS;
    const src = kids ? AM.KIDS : { CAST: AM.CAST, FEED: AM.FEED, REPLIES: AM.REPLIES, STORY: AM.STORY };
    W = { kind: kids ? 'kids' : 'city', kids };
    CAST = src.CAST;
    C = {};
    CAST.forEach(c => { C[c.id] = c; });
    SUSPECTS = CAST.filter(c => c.suspect).map(c => c.id);
    R = Object.assign({ topics: {}, generic: [], followup: {}, dm: {}, dmHello: {}, dmOverheard: [], quote: [], prompts: [] }, src.REPLIES || {});
    FEED = src.FEED || [];
    ST = src.STORY;
    NO_REPLY = new Set(ST.noReply || ['overheard']);
    ROLE = ST.roles || {};
    SIG = new RegExp('\\s*(' + SUSPECTS.map(id => C[id].suspect.emoji).join('|') + ')', 'g');
    TOPICS = [['overheard', new RegExp(ST.world.mysteryRx, 'i')]].concat(kids ? KID_TOPICS : [], BASE_TOPICS);
    T = kids ? null : AM.TONE || null;
  }
  const TIERS = {
    nobody: { label: 'Nobody', followers: 87, note: 'every like counts' },
    rising: { label: 'Rising', followers: 4200, note: 'people know you' },
    famous: { label: 'Famous', followers: 1300000, note: 'expect chaos' }
  };
  const DURATIONS = [[12, '12 min', 'demo'], [60, '1h'], [120, '2h'], [180, '3h'], [300, '5h'], [480, '8h'], [720, '12h']];
  const EMOJIS = ['😎', '🤠', '🦊', '🐸', '👽', '🦄', '🐙', '🍩', '🌵', '🧃', '🛸', '🐼'];
  const HUES = [210, 330, 15, 140, 265, 45, 185, 0];
  const ALGOS = [['balanced', 'For you'], ['drama', 'More drama'], ['wholesome', 'Wholesome'], ['memes', 'Memes']];
  const MILESTONES = [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];

  // ---------- icons ----------
  const sv = (body, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${body}</svg>`;
  const PLANE_PATH = 'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z';
  const I = {
    home: sv('<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'),
    search: sv('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    plus: sv('<path d="M12 5v14M5 12h14"/>', 'stroke-width="2.6"'),
    bell: sv('<path d="M6 16v-5a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>'),
    mail: sv('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    back: sv('<path d="M15 5l-7 7 7 7"/>', 'stroke-width="2.4"'),
    gear: sv('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>', 'stroke-width="1.8"'),
    heart: sv('<path d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5C19 15.6 12 20 12 20z"/>'),
    reply: sv('<path d="M4 5h16v11H9l-5 4z"/>'),
    repost: sv('<path d="M17 3l3 3-3 3"/><path d="M4 11V9a3 3 0 0 1 3-3h13"/><path d="M7 21l-3-3 3-3"/><path d="M20 13v2a3 3 0 0 1-3 3H4"/>'),
    views: sv('<path d="M5 20v-8M10 20V6M15 20v-9M20 20V9"/>'),
    close: sv('<path d="M6 6l12 12M18 6 6 18"/>', 'stroke-width="2.4"'),
    image: sv('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-5-5-9 8"/>'),
    speaker: sv('<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>'),
    seatbelt: sv('<rect x="8" y="9" width="8" height="6" rx="1.5"/><path d="M2 12h6M16 12h6"/>'),
    follow: sv('<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6"/>'),
    flame: sv('<path d="M12 22c4 0 7-3 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-3 2-5 5-5 8 0 4 3 7 7 7z"/>'),
    trophy: sv('<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M10 17h4"/>'),
    bulb: sv('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>'),
    star: sv('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'),
    brush: sv('<path d="M14 4l6 6-9 9H5v-6z"/><path d="M12 6l6 6"/>'),
    undo: sv('<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>'),
    lock: sv('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    mystery: sv('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M9.2 9.2a2 2 0 1 1 2.6 2.4c-.6.3-.8.7-.8 1.2M11 15h.01"/>'),
    verified: '<svg viewBox="0 0 24 24" aria-label="Verified"><path fill="currentColor" d="M12 2l2.4 1.8 3 .1.9 2.8 2.4 1.8-.9 2.9.9 2.9-2.4 1.8-.9 2.8-3 .1L12 22l-2.4-1.8-3-.1-.9-2.8-2.4-1.8.9-2.9-.9-2.9 2.4-1.8.9-2.8 3-.1z"/><path d="m8.5 12.2 2.4 2.3 4.6-4.8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    planeUp: `<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="${PLANE_PATH}"/></svg>`,
    planeRight: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="${PLANE_PATH}" transform="rotate(90 12 12)"/></svg>`
  };

  // ---------- helpers ----------
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr, r) => arr[Math.floor((r ? r() : Math.random()) * arr.length)];
  const first = name => String(name).split(' ')[0];
  const ease = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const trimText = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);
  function shuffle(arr, r) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor((r ? r() : Math.random()) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function fmtNum(n) {
    n = Math.round(n);
    if (n < 1000) return String(n);
    if (n < 10000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    if (n < 1e6) return Math.round(n / 1000) + 'K';
    return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  function fmtAgo(ms) {
    const s = Math.max(0, ms / 1000);
    if (s < 60) return Math.max(1, Math.floor(s)) + 's';
    const m = s / 60; if (m < 60) return Math.floor(m) + 'm';
    const h = m / 60; if (h < 24) return Math.floor(h) + 'h';
    return Math.floor(h / 24) + 'd';
  }
  function fmtDur(ms) {
    if (ms < MIN) return Math.max(1, Math.round(ms / 1000)) + 's';
    const m = Math.round(ms / MIN), h = Math.floor(m / 60);
    return h ? h + 'h ' + String(m % 60).padStart(2, '0') + 'm' : m + 'm';
  }
  const fmtFlight = min => (min < 60 ? min + ' min' : min % 60 ? Math.floor(min / 60) + 'h ' + (min % 60) + 'm' : min / 60 + 'h');
  const clockTime = t => new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const countText = n => (n > 0 ? fmtNum(n) : '');

  // ---------- state ----------
  let S = null;
  let postIndex = new Map();
  const ui = { tab: 'home', stack: [], query: '', stripOpen: false, compose: null, replyTo: null, board: null,
    pillSince: 0, pillCount: -1, homeKey: '', prevRevealed: 0, lastTouch: 0, audio: null, activitySeen: 0, confirmNew: false, ticking: false };

  const now = () => Date.now() + (S && S.skew ? S.skew : 0);
  const progress = t => (S ? clamp((t - S.flight.start) / S.flight.duration, 0, 1) : 0);

  function save() {
    if (!S) return;
    try { localStorage.setItem(KEY, JSON.stringify(S)); }
    catch (e) {
      // Storage is full: keep only the newest few photos and try once more.
      try {
        const withPhoto = S.posts.filter(p => p.photo);
        withPhoto.slice(0, Math.max(0, withPhoto.length - 4)).forEach(p => { p.photo = null; p.photoGone = true; });
        localStorage.setItem(KEY, JSON.stringify(S));
      } catch (e2) { /* the flight still runs in memory */ }
    }
  }
  let saveTimer = 0;
  function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(save, 1200); }
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); return s && s.v === 1 && s.player ? s : null; }
    catch (e) { return null; }
  }
  function reindex() { postIndex = new Map(S.posts.map(p => [p.id, p])); }
  function addPost(p) {
    let i = S.posts.length;
    while (i > 0 && S.posts[i - 1].t > p.t) i--;
    S.posts.splice(i, 0, p);
    postIndex.set(p.id, p);
  }
  function schedule(e) {
    let i = S.queue.length;
    while (i > 0 && S.queue[i - 1].t > e.t) i--;
    S.queue.splice(i, 0, e);
  }

  // ---------- world context and text ----------
  function ctx() {
    const f = S.flight, cul = C[f.culprit];
    const to = S.player.to && S.player.to !== 'AWAY' ? S.player.to : 'your destination';
    return {
      name: first(S.player.name), handle: S.player.handle, seat: S.player.seat, to,
      culprit: first(cul.name), culpritName: first(cul.name), culpritHandle: cul.handle,
      decoy1: f.decoy1, decoy1Name: first(C[f.decoy1].name), decoy2Name: first(C[f.decoy2].name),
      correct: !!(S.accuse && S.accuse.id === f.culprit),
      calledAgo: S.accuse && S.revealT ? fmtDur(Math.max(1000, S.revealT - S.accuse.t)) : '',
      vk: { culprit: f.culprit, decoy1: f.decoy1, winner: f.winner, case: cul.suspect.lower ? 'lower' : 'proper', ending: ST.endingKey(S.flags) }
    };
  }
  function fill(text, c) { c = c || ctx(); return String(text).replace(/\{(\w+)\}/g, (m, k) => (c[k] != null ? c[k] : m)); }
  // The suspects' signature emoji are mystery clues; scrub them from everyone else's written lines.
  const scrub = s => String(s).replace(SIG, '');
  // Suspects (and Overheard, written by whichever suspect runs it) always type the same way.
  function style(by, text) {
    const sid = by === 'overheard' ? S.flight.culprit : by;
    const c = C[sid];
    if (!c || !c.suspect) return text;
    let out = String(text).replace(SIG, ' ').trim();
    if (c.suspect.lower) out = out.toLowerCase();
    return out + ' ' + c.suspect.emoji;
  }
  function author(id) {
    if (id === 'me') return { id, name: S.player.name, handle: S.player.handle, emoji: S.player.emoji, hue: S.player.hue, verified: false };
    const c = C[id] || C.kai;
    return { id, name: c.name, handle: c.handle, emoji: c.emoji, hue: c.hue, verified: c.verified, anon: id === 'overheard' };
  }
  function ohFollowers(t) {
    const p = progress(t);
    return p < 0.08 ? 0 : Math.round(180 + 151000 * ease((p - 0.08) / 0.84));
  }
  function baseLikes(by, r) {
    const F = by === 'overheard' ? 20000 : C[by].followers;
    return Math.round(F * (0.003 + r() * 0.025) + 4 + r() * 30);
  }

  // ---------- posts ----------
  function instantiate(def, t, kind) {
    const c = ctx();
    let by = def.by;
    if (by.charAt(0) === '{') by = c[by.slice(1, -1)];
    let text = def.text;
    if (typeof text === 'object') text = text[c.vk[def.variant]];
    text = fill(text, c);
    if (kind === 'feed') text = scrub(text);
    text = style(by, text);
    const id = kind === 'feed' ? def.id + '.' + (++S.seq) : def.id;
    const seed = AM.hash(id + ':' + S.flight.seed);
    const r = AM.rng(seed);
    const likes = def.likes ? Math.round(def.likes * (0.8 + r() * 0.4)) : baseLikes(by, r);
    const gap = clamp(S.flight.duration * 0.012, 6000, 4 * MIN);
    const replies = (def.replies || []).map((rp, i) => {
      let rt = fill(rp.text, c);
      if (kind === 'feed') rt = scrub(rt);
      return { id: id + 'r' + i, by: rp.by, t: t + gap * (0.6 + i * 0.9 + r() * 0.5), text: style(rp.by, rt), likes: Math.round(likes * (0.01 + r() * 0.08)) };
    });
    return { id, by, t, text, scene: def.scene || null, seed, likes, poll: def.poll || null, pollId: def.pollId || null,
      live: !!def.live, replies, tags: def.tags || [], vibe: def.vibe || null };
  }
  function likesNow(p, t) {
    const tau = p.tau || clamp(S.flight.duration * 0.05, 25000, 30 * MIN);
    return Math.round(p.likes * (1 - Math.exp(-Math.max(0, t - p.t) / tau))) + (S.liked[p.id] ? 1 : 0);
  }
  const frac = p => (p.seed % 1000) / 1000;
  const repliesNow = (p, t) => p.replies.filter(r => r.t <= t).length;
  const repostsNow = (p, t) => Math.round((likesNow(p, t) - (S.liked[p.id] ? 1 : 0)) * (0.04 + frac(p) * 0.08)) + (S.reposted[p.id] ? 1 : 0);
  const viewsNow = (p, t) => Math.round(likesNow(p, t) * (9 + frac(p) * 14)) + (p.by === 'me' ? repliesNow(p, t) * 7 : 0);

  function chooseFiller() {
    if (!FEED.length) return null;
    let used = new Set(S.usedFeed);
    let pool = FEED.filter(d => !used.has(d.id) && !d.early);
    if (!pool.length) {
      S.usedFeed = S.usedFeed.slice(-40);
      used = new Set(S.usedFeed);
      pool = FEED.filter(d => !used.has(d.id));
    }
    const ints = new Set(S.player.interests);
    const w = pool.map(d => {
      let x = 1;
      if ((d.tags || []).some(tg => ints.has(tg))) x += 2.2;
      if (S.algo !== 'balanced' && d.vibe === S.algo) x *= 3.5;
      return x;
    });
    let roll = Math.random() * w.reduce((a, b) => a + b, 0);
    for (let i = 0; i < pool.length; i++) { roll -= w[i]; if (roll <= 0) { S.usedFeed.push(pool[i].id); return pool[i]; } }
    S.usedFeed.push(pool[pool.length - 1].id);
    return pool[pool.length - 1];
  }
  function spawnFiller(t) {
    if (T && rivalryPost(t)) return;
    if (AM.LEARN && Math.random() < 0.07 && learnPost(t)) return;
    const def = chooseFiller();
    if (def) addPost(instantiate(def, t, 'feed'));
  }
  // Now and then the feed carries a fact from the Learn deck, with a link to the tab.
  function learnPost(t) {
    const host = W.kids ? 'olive' : 'hcnow';
    if (!C[host]) return false;
    S.learnPosted = S.learnPosted || {};
    const pool = AM.LEARN.filter(c => c.type === 'fact' && (!W.kids || c.kids) && !S.learnPosted[c.id]);
    if (!pool.length) return false;
    const c = pick(pool);
    S.learnPosted[c.id] = 1;
    const id = 'lp' + (++S.seq), seed = AM.hash(id + S.flight.seed);
    addPost({ id, by: host, t, text: W.kids ? 'Fun fact! ' + (c.kid || c.fact) : 'Did you know? ' + c.fact, seed, likes: baseLikes(host, AM.rng(seed)), replies: [], tags: [], learnId: c.id });
    return true;
  }
  // Now and then a slot goes to someone with feelings about the player: rivals subtweet or bait, fans shout out.
  function rivalryPost(t) {
    if (t - (S.lastRivalT || 0) < Math.max(60000, S.flight.duration * 0.05) || Math.random() > 0.35) return false;
    const ids = Object.keys(S.rel || {}).filter(id => C[id] && !NO_REPLY.has(id));
    const rivals = ids.filter(id => relOf(id) <= -4), fans = ids.filter(id => relOf(id) >= 4);
    let by, pool, kind;
    if (rivals.length && (!fans.length || Math.random() < 0.6)) { by = pick(rivals); kind = Math.random() < 0.4 ? 'bait' : 'subtweet'; pool = T[kind]; }
    else if (fans.length) { by = pick(fans); kind = 'shoutout'; pool = T.shoutout; }
    else return false;
    const line = pickTagged(pool, by);
    if (!line) return false;
    S.lastRivalT = t;
    const id = 'rv' + (++S.seq), seed = AM.hash(id + S.flight.seed);
    const text = style(by, scrub(fill(line)));
    addPost({ id, by, t, text, seed, likes: baseLikes(by, AM.rng(seed)), replies: [], tags: [], rivalry: kind });
    if (text.includes('@' + S.player.handle)) {
      addNotif({ t, type: kind === 'shoutout' ? 'like' : 'beef', by: [by], html: kind === 'shoutout' ? `<b>${esc(C[by].name)}</b> gave you a shoutout` : `<b>${esc(C[by].name)}</b> is coming for you`, quote: text, go: { post: id } });
    }
    return true;
  }

  // ---------- a new flight ----------
  function newWorld(b) {
    useWorld(b.world);
    const seed = (Math.random() * 4294967296) >>> 0, r = AM.rng(seed);
    const culprit = pick(SUSPECTS, r);
    const others = shuffle(SUSPECTS.filter(x => x !== culprit), r);
    const start = Date.now(), duration = b.dur * MIN;
    S = {
      v: 1, skew: 0, world: W.kind, rel: {}, argue: {}, learned: {}, quiz: {}, blocked: {}, insults: {}, apologized: {}, lastRivalT: 0,
      player: { name: b.name, handle: b.handle, emoji: b.emoji, hue: b.hue, from: b.from, to: b.to, seat: b.seat, tier: b.tier,
        interests: b.interests, startFollowers: b.carry != null ? b.carry : TIERS[b.tier].followers },
      flight: { start, duration, minutes: b.dur, seed, culprit, decoy1: others[0], decoy2: others[1], winner: pick(ST.game.teams, r),
        no: 'AM ' + (100 + (seed % 900)) },
      algo: 'balanced', flags: {}, accuse: null, revealT: 0, fired: {}, dmSent: {}, posts: [], slots: [], slotIdx: 0, usedFeed: [],
      revealedUntil: start, liked: {}, reposted: {}, polls: {}, notifs: [], seenNotifT: start, dms: {}, following: {}, followedBy: {},
      mine: [], stats: { posts: 0, repliesGot: 0 }, bonus: 0, lastF: 0, lastFT: 0, queue: [], usedLines: {}, seq: 0,
      landed: false, wrapped: false, sound: true
    };
    S.lastF = S.player.startFollowers;
    reindex();
    ST.backlog.forEach(d => addPost(instantiate(d, start - d.ago * MIN, 'story')));
    FEED.filter(d => d.early).forEach(d => { S.usedFeed.push(d.id); addPost(instantiate(d, start - rand(6, 420) * MIN, 'feed')); });
    const n = Math.round(clamp(40 + b.dur * 0.6, 40, 420));
    for (let i = 0; i < n; i++) S.slots.push(start + ((i + 0.3 + r() * 0.4) / n) * 0.985 * duration);
    addNotif({ t: start, type: 'flight', html: `Welcome aboard, <b>${esc(first(b.name))}</b>. Your feed is packed for a ${esc(fmtFlight(b.dur))} flight. Everyone here is AI and make-believe, and nothing you post leaves this phone.` });
    ST.welcome.forEach((m, i) => schedule({ t: start + 4000 + i * 3500, kind: 'dm', who: m.who, text: m.text }));
    if (!W.kids && AM.AI && AM.AI.supported() && !AM.AI.installed()) {
      addNotif({ t: start + 1, type: 'flight', html: '<b>New: AI replies.</b> Characters can read what you write and answer it, with no internet. Download it once on wifi in Settings.', go: { settings: true } });
    }
    save();
  }

  // ---------- the clock ----------
  let BEAT_ORDER = null;
  function tick() {
    if (!S) return;
    const t = now();
    let changed = false;
    if (!BEAT_ORDER) BEAT_ORDER = ST.beats.map((b, i) => i).sort((a, b) => ST.beats[a].at - ST.beats[b].at);
    for (const i of BEAT_ORDER) {
      if (S.fired[i]) continue;
      const b = ST.beats[i], bt = S.flight.start + b.at * S.flight.duration;
      if (bt > t) break;
      S.fired[i] = 1; changed = true;
      if (!b.when || b.when(S.flags, ctx())) runBeat(b, bt);
    }
    while (S.slotIdx < S.slots.length && S.slots[S.slotIdx] <= t) { spawnFiller(S.slots[S.slotIdx]); S.slotIdx++; changed = true; }
    while (S.queue.length && S.queue[0].t <= t) {
      const e = S.queue.shift();
      if (e.ai === 1 && t - (e.due || (e.due = e.t)) < 30000) { e.t = t + 800; schedule(e); continue; }
      if (e.ai === 1) e.ai = 3;
      runEvent(e); changed = true;
    }
    if (checkMilestones(t)) changed = true;
    if (!S.landed && progress(t) >= 1) { S.landed = true; changed = true; }
    if (S.landed && !S.wrapped && !ui.board) { S.wrapped = true; changed = true; setTimeout(showWrapped, 1500); }
    updateStrip(t); updateNewPill(t); updateCounts(t); updateBadges();
    if (changed) { refreshOpen(); saveSoon(); }
  }
  function startTicking() {
    if (ui.ticking) return;
    ui.ticking = true;
    setInterval(tick, 1000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); else save(); });
    window.addEventListener('pagehide', save);
  }

  function runBeat(b, bt) {
    const fresh = now() - bt < 45000;
    if (b.pa) {
      const text = fill(b.pa);
      addNotif({ t: bt, type: 'flight', html: esc(text) });
      if (fresh) showPA(text, b);
    }
    if (b.notify) addNotif({ t: bt, type: b.notify.icon, html: esc(b.notify.text), go: { profile: 'overheard' } });
    if (b.dm && !S.dmSent[b.dm]) startStoryDm(b.dm, bt);
    if (b.post && (!b.post.when || b.post.when(S.flags, ctx()))) {
      addPost(instantiate(b.post, bt, 'story'));
      if (b.reveal) onReveal(bt, fresh);
      if (b.post.id === ST.game.post) resolveGame(bt);
    }
  }
  function onReveal(bt, fresh) {
    S.revealT = bt;
    const c = ctx(), cul = C[S.flight.culprit];
    let html;
    if (c.correct) {
      const gain = Math.max(60, Math.round(followersNow(bt) * 0.25));
      S.bonus += gain;
      html = `<b>You called it.</b> Overheard was ${esc(cul.name)}, and you knew ${esc(c.calledAgo)} before the reveal. +${fmtNum(gain)} followers.`;
    } else if (S.accuse) html = `Overheard was <b>${esc(cul.name)}</b>. You guessed ${esc(C[S.accuse.id].name)}.`;
    else html = `Overheard was <b>${esc(cul.name)}</b>. You never made a call.`;
    addNotif({ t: bt + 1, type: 'mystery', html, go: { profile: 'overheard' } });
    if (fresh) toast({ who: 'overheard', title: 'Overheard unmasked', text: html.replace(/<[^>]+>/g, ''), go: { profile: 'overheard' } });
  }
  function resolveGame(bt) {
    const pick_ = S.flags.gamePick, w = S.flight.winner, team = esc(ST.game.names[w]), go_ = { post: ST.game.post };
    if (!pick_) return;
    if (pick_ === w) {
      const gain = Math.max(20, Math.round(followersNow(bt) * 0.05));
      S.bonus += gain;
      addNotif({ t: bt + 1, type: 'game', html: W.kids ? `<b>You called it!</b> ${team} won the race. Gold star for you!` : `<b>You called the game.</b> ${team} win. +${fmtNum(gain)} followers.`, go: go_ });
    } else addNotif({ t: bt + 1, type: 'game', html: W.kids ? `${team} won! Great race, everybody.` : `The ${team} won. Your pick didn't.`, go: go_ });
  }

  // ---------- DMs ----------
  function dmOf(who) { return S.dms[who] || (S.dms[who] = { msgs: [], unread: 0, choices: null }); }
  function chatOpen(who) { const top = ui.stack[ui.stack.length - 1]; return !!(top && top.type === 'chat' && top.id === who); }
  function pushMsg(who, m) {
    const d = dmOf(who);
    d.msgs.push(m);
    if (m.from === 'them' && !chatOpen(who)) d.unread++;
  }
  function startStoryDm(id, bt) {
    S.dmSent[id] = true;
    const def = ST.dms[id];
    let msgs = def.messages;
    (def.variants || []).forEach(v => { if (v.when(S.flags)) msgs = v.messages; });
    let t = bt + 1200;
    msgs.forEach(m => { schedule({ t, kind: 'dm', who: def.with, text: m }); t += 1400 + Math.min(2600, m.length * 35); });
    schedule({ t: t - 600, kind: 'choices', who: def.with, dm: id, path: [] });
  }
  function choiceOptions(d) {
    if (!d.choices) return null;
    let opts = ST.dms[d.choices.dm].choices;
    d.choices.path.forEach(i => { opts = opts[i].next; });
    return opts;
  }
  function choose(who, k) {
    const d = dmOf(who), opts = choiceOptions(d);
    if (!opts || !opts[k]) return;
    const o = opts[k], path = d.choices.path.concat(k), dmId = d.choices.dm, t0 = now();
    d.choices = null;
    pushMsg(who, { from: 'me', text: o.label, t: t0 });
    if (o.set) Object.assign(S.flags, o.set);
    let t = t0 + 1500;
    (o.reply || []).forEach(m => { schedule({ t, kind: 'dm', who, text: m }); t += 1300 + Math.min(2400, m.length * 30); });
    if (o.next) schedule({ t, kind: 'choices', who, dm: dmId, path });
    if (o.action) schedule({ t: t + 600, kind: 'action', name: o.action });
    refreshOpen(); saveSoon();
  }
  function dmReply(who, text) {
    const low = text.toLowerCase(), c = C[who], v = c.voice;
    const aboutOH = TOPICS[0][1].test(low) || /secret|leak|\btea\b|clue/.test(low);
    const tone = T ? detectTone(text, true) : null;
    if (T && AM.REACT && tone === 'insult' && who !== 'overheard') return Object.assign(reactToInsult(who, hostility(text, true)), { styled: true });
    const scripted = who === 'overheard' || (c.suspect && !S.revealT && (aboutOH || /\bis it you\b|\bare you\b|\bit'?s you\b/.test(low)));
    if (tone && who !== 'overheard') bump(who, { rage: -1, snark: -1, nice: 1.5 }[tone]);
    let pool;
    if (who === 'overheard') pool = S.revealT ? (ST.overheardRetired || ST.overheardDm) : ST.overheardDm;
    else if (c.suspect && !S.revealT && (aboutOH || /\bis it you\b|\bare you\b|\bit'?s you\b/.test(low))) pool = ST.suspectDm[who];
    else if (T && (tone === 'snark' || tone === 'insult') && (T.dmSnark[v] || []).length) pool = T.dmSnark[v];
    else if (T && tone === 'rage' && (T.dmRage[v] || []).length) pool = T.dmRage[v];
    else if (T && tone === 'nice' && (T.dmNice[v] || []).length) pool = T.dmNice[v];
    else if (aboutOH && !S.revealT && R.dmOverheard.length) pool = R.dmOverheard;
    else if (/^\s*(hi+|hey+|hello|yo|sup|hiya|howdy|gm|good (morning|evening|afternoon))\b/.test(low) && (R.dmHello[v] || []).length) pool = R.dmHello[v];
    else pool = (R.dm[v] || []).length ? R.dm[v] : ['haha wait tell me more', 'ok but are you on a plane right now'];
    return { text: pickFresh(pool, 'dm' + who), kind: scripted ? null : tone || 'dm' };
  }
  function sendDm(who, text) {
    if (isBlocked(who)) return;
    pushMsg(who, { from: 'me', text, t: now() });
    const r = dmReply(who, text), at = now() + rand(2600, 6200), ev = { t: at, kind: 'dm', who, text: r.text, styled: !!r.styled };
    schedule(r.kind ? aiAttach(ev, who, r.kind === 'insult' ? 'clap' : r.kind, { dm: dmHistory(who) }, 4) : ev);
    if (r.block) schedule({ t: at + 900, kind: 'block', who });
    refreshOpen(); saveSoon();
  }
  function pickFresh(arr, ns) {
    const fresh = arr.filter(x => !S.usedLines[AM.hash(ns + x)]);
    const x = pick(fresh.length ? fresh : arr);
    S.usedLines[AM.hash(ns + x)] = 1;
    return x;
  }

  function runAction(name) {
    const t = now();
    if (name === 'postLeak') {
      playerPost({ text: ST.leak.caption, shot: true, forced: 'leak' });
      toast({ who: 'me', title: 'Posted', text: 'The screenshot is on your profile. Brace yourself.', go: { tab: 'home' } });
      const ferris = ST.beats.find(b => b.post && b.post.id === 's_ferris_saved');
      if (ferris && progress(t) > ferris.at && !postIndex.get('s_ferris_saved')) schedule({ t: t + 45000, kind: 'storyPost', id: 's_ferris_saved' });
      if (progress(t) > 0.58 && !S.dmSent.jade2) startStoryDm('jade2', t + 30000);
    } else if (name === 'relayToJade') {
      const v = S.flags.posted ? ST.relay.posted : ST.relay.plain;
      pushMsg('jade', { from: 'me', text: v.you, t });
      let tt = t + 3000;
      v.jade.forEach(m => { schedule({ t: tt, kind: 'dm', who: 'jade', text: m }); tt += 2200; });
    } else if (name === 'jadeUnfollow') {
      S.flags.jadeUnfollowed = true;
      S.bonus -= 1;
      addNotif({ t, type: 'follow', by: ['jade'], html: '<b>Jade Moreno</b> unfollowed you.', go: { profile: 'jade' } });
    }
  }

  function runEvent(e) {
    const fresh = now() - e.t < 20000;
    if (e.kind === 'reply') {
      const p = postIndex.get(e.post);
      if (!p) return;
      const r = { id: p.id + 'x' + (++S.seq), by: e.by, text: e.text, t: e.t, likes: e.likes != null ? e.likes : Math.round(Math.random() * 6), ratio: !!e.ratio, to: e.to || null };
      p.replies.push(r);
      if (p.by === 'me' || e.to) {
        S.stats.repliesGot++;
        addNotif({ t: e.t, type: 'reply', by: [e.by], html: `<b>${esc(C[e.by].name)}</b> replied${e.to ? ' to you' : ''}`, quote: r.text, go: { post: p.id } });
        if (e.ratio) addNotif({ t: e.t + 1, type: 'viral', html: `You're getting ratioed. <b>${esc(C[e.by].name)}</b>'s reply has more likes than your post.`, go: { post: p.id } });
        if (e.by !== 'overheard' && !S.followedBy[e.by] && Math.random() < 0.25) {
          S.followedBy[e.by] = true;
          addNotif({ t: e.t + 2, type: 'follow', by: [e.by], html: `<b>${esc(C[e.by].name)}</b> followed you`, go: { profile: e.by } });
        }
      }
    } else if (e.kind === 'block') {
      S.blocked[e.who] = true;
      if (S.dms[e.who] && S.dms[e.who].msgs.length) pushMsg(e.who, { from: 'sys', text: C[e.who].name + ' blocked you.', t: e.t });
      addNotif({ t: e.t, type: 'beef', by: [e.who], html: '<b>' + esc(C[e.who].name) + '</b> blocked you', go: { profile: e.who } });
      if (fresh && !chatOpen(e.who)) toast({ who: e.who, title: C[e.who].name + ' blocked you', text: 'You can send an apology from their profile.', go: { profile: e.who } });
    } else if (e.kind === 'apology') {
      const kind = AM.REACT.style[C[e.who].voice] || 'hurt';
      const odds = { hurt: 0.75, deflect: 0.7, formal: 0.5, pr: 0.85, bot: 0.6, clap: 0.4 }[kind] - ((S.insults[e.who] || 0) > 4 ? 0.2 : 0);
      if (Math.random() < odds) {
        S.blocked[e.who] = false; S.insults[e.who] = 0; bump(e.who, 4);
        pushMsg(e.who, { from: 'them', text: style(e.who, pick(AM.REACT.apologyYes)), t: e.t });
        addNotif({ t: e.t, type: 'follow', by: [e.who], html: '<b>' + esc(C[e.who].name) + '</b> accepted your apology and unblocked you', go: { chat: e.who } });
      } else addNotif({ t: e.t, type: 'beef', by: [e.who], html: '<b>' + esc(C[e.who].name) + '</b> saw your apology', quote: style(e.who, pick(AM.REACT.apologyNo)), go: { profile: e.who } });
    } else if (e.kind === 'likeReply') {
      const p = postIndex.get(e.post), r = p && p.replies.find(x => x.id === e.rid);
      if (!r) return;
      r.likedBy = e.by; r.likes++;
      addNotif({ t: e.t, type: 'like', by: [e.by], html: `<b>${esc(C[e.by].name)}</b> liked your reply`, quote: r.text, go: { post: p.id } });
    } else if (e.kind === 'quote') {
      const id = 'q' + (++S.seq), seed = AM.hash(id + S.flight.seed);
      const text = style(e.by, scrub(fill(pickFresh(R.quote.length ? R.quote : ['this.'], 'q'))));
      const p = { id, by: e.by, t: e.t, text, quoteOf: e.post, seed, likes: baseLikes(e.by, AM.rng(seed)), replies: [], tags: [] };
      addPost(p);
      addNotif({ t: e.t, type: 'repost', by: [e.by], html: `<b>${esc(C[e.by].name)}</b> quoted your post`, quote: text, go: { post: id } });
    } else if (e.kind === 'dm') {
      const isShot = e.text === '[screenshot]';
      const text = isShot ? '' : e.styled ? e.text : style(e.who, fill(e.text));
      pushMsg(e.who, { from: 'them', text, t: e.t, kind: isShot ? 'shot' : null });
      if (fresh && !chatOpen(e.who)) {
        toast({ who: e.who, title: C[e.who].name, text: isShot ? 'Sent a screenshot' : text, go: { chat: e.who } });
        blip();
      }
    } else if (e.kind === 'choices') {
      dmOf(e.who).choices = { dm: e.dm, path: e.path };
    } else if (e.kind === 'action') {
      runAction(e.name);
    } else if (e.kind === 'storyPost') {
      const b = ST.beats.find(x => x.post && x.post.id === e.id);
      if (b && !postIndex.get(e.id)) addPost(instantiate(b.post, e.t, 'story'));
    } else if (e.kind === 'notif') {
      addNotif(Object.assign({ t: e.t }, e.n));
    }
  }

  // ---------- notifications ----------
  function addNotif(n) {
    n.id = 'n' + (++S.seq);
    S.notifs.push(n);
    if (S.notifs.length > 220) S.notifs.splice(0, S.notifs.length - 220);
  }
  function followersNow(t) {
    let f = S.player.startFollowers + (S.bonus || 0);
    S.mine.forEach(id => { const p = postIndex.get(id); if (p && p.gain) f += p.gain * (1 - Math.exp(-Math.max(0, t - p.t) / p.tau)); });
    return Math.max(0, Math.round(f));
  }
  function likersFor(p) {
    const r = AM.rng(p.seed);
    return shuffle(CAST.filter(c => !NO_REPLY.has(c.id) && c.id !== 'hcnow').map(c => c.id), r).slice(0, 3);
  }
  function checkMilestones(t) {
    let changed = false;
    S.mine.forEach(id => {
      const p = postIndex.get(id);
      if (!p) return;
      const L = likesNow(p, t) - (S.liked[p.id] ? 1 : 0);
      let hit = 0;
      for (const m of MILESTONES) if (m <= L && m > (p.ms || 0)) hit = m;
      if (!hit) return;
      p.ms = hit; changed = true;
      const who = likersFor(p);
      const nm = esc(C[who[0]].name);
      if (W.kids) {
        if (hit <= 25) addNotif({ t, type: 'star', by: who.slice(0, L > 2 ? 3 : 1), html: L === 1 ? `<b>${nm}</b> gave your post a gold star!` : `<b>${nm}</b> and friends gave your post gold stars!`, quote: p.text || (p.drawing ? 'Your drawing' : 'Your post'), go: { post: p.id } });
        return;
      }
      addNotif({ t, type: 'like', by: who.slice(0, L > 2 ? 3 : 1), html: L === 1 ? `<b>${nm}</b> liked your post` : `<b>${nm}</b> and ${fmtNum(L - 1)} others liked your post`,
        quote: p.text || 'Photo', go: { post: p.id } });
    });
    if (W.kids) return changed;
    const F = followersNow(t), step = Math.max(3, Math.round(F * 0.01));
    if (F - S.lastF >= step && t - S.lastFT > 15000) {
      addNotif({ t, type: 'follow', html: `<b>${fmtNum(F - S.lastF)}</b> new followers`, go: { profile: 'me' } });
      S.lastF = F; S.lastFT = t; changed = true;
    }
    if (F < S.lastF) S.lastF = F;
    return changed;
  }

  // ---------- the player's posts and what the world does about them ----------
  const KID_TOPICS = [
    ['drawing', /\b(drew|draw|drawing|doodle|colou?red|painting|sketch)\b/],
    ['joke', /knock knock|\bjoke|why did|what do you call|riddle|\bhaha/],
    ['space', /space|planet|rocket|\bmoon\b|\bstars?\b|alien|astronaut/],
    ['school', /school|teacher|\bclass\b|homework|recess|spelling/],
    ['family', /\b(mom|dad|mommy|daddy|mum|sister|brother|grandma|grandpa|nana|family|baby)\b/]
  ];
  const BASE_TOPICS = [
    ['hottake', /hot take|unpopular opinion|overrated|underrated|fight me|controversial|said what i said|change my mind/],
    ['greeting', /^(hi+|hey+|hello|yo|sup|gm|good morning|good evening|hello world|first post)\b/],
    ['plane', /plane|flight|flying|\bfly\b|seat|aisle|turbulence|pilot|captain|attendant|cabin|tray table|legroom|take ?off|landing|airport|\bgate\b|boarding|layover|jet ?lag|armrest|overhead bin|carry.?on|wifi/],
    ['food', /food|snack|pretzel|peanut|meal|\beat|\bate\b|hungry|pizza|pasta|coffee|\btea\b|lunch|dinner|breakfast|chicken|sandwich|cookie|chips|wine|beer|cocktail|juice|soda|delicious|tasty|\byum/],
    ['view', /view|cloud|\bsky\b|sunset|sunrise|ocean|mountain|city lights|below us|out the window/],
    ['selfie', /selfie|outfit|fit check|ootd|my face|new hair|haircut|me rn|looking good/],
    ['pet', /\bdogs?\b|\bcats?\b|puppy|kitten|\bpets?\b|\bpup\b|doggo/],
    ['work', /\bwork|\bjob\b|boss|meeting|email|office|deadline|coworker|monday|client|presentation/],
    ['sports', /\bgame\b|\bteam\b|score|herons|rockets|basketball|football|soccer|baseball|hockey|\bmatch\b|playoff/],
    ['music', /music|\bsong|playlist|album|concert|\bband\b|listening to|headphones|\bdj\b/],
    ['love', /crush|\bdate\b|dating|boyfriend|girlfriend|\bbf\b|\bgf\b|husband|wife|single|in love|relationship|\bex\b|kiss/],
    ['sad', /\bsad\b|lonely|\bcry|crying|rough day|bad day|homesick|anxious|stressed|heartbroken|\bmiss (you|him|her|home|my)/],
    ['achievement', /finally|promoted|promotion|got the job|passed|graduated|engaged|new job|milestone|proud of|i did it|just won/],
    ['complaint', /\bhate\b|annoying|worst|\bugh\b|why is|why do|can'?t stand|so rude|terrible|\brant\b|kicking my seat|smells/],
    ['excited', /excited|can'?t wait|let'?s go|vacation|\btrip\b|holiday|so ready|!!/],
    ['gaming', /gaming|video game|xbox|playstation|nintendo|controller|gamer|boss fight|speedrun/],
    ['fitness', /\bgym\b|workout|\brun\b|running|lifting|squat|cardio|\bsteps\b|yoga|marathon|protein/],
    ['fashion', /fashion|\bdress|shoes|sneakers|jacket|\bstyle\b|thrift/],
    ['tech', /phone|laptop|\bapp\b|coding|\bcode\b|\bai\b|computer|battery|charger|bluetooth|airplane mode/],
    ['weather', /weather|\brain\b|snow|sunny|\bcold\b|storm|forecast|humid|freezing/],
    ['sleep', /sleep|\bnap\b|asleep|insomnia|tired|exhausted|yawn|red.?eye/],
    ['question', /\?/]
  ];
  const PHOTO_TOPIC = { food: 'food', view: 'view', selfie: 'selfie', pet: 'pet', plane: 'plane', other: 'photo', drawing: 'drawing' };
  function classify(text, tag, hasPhoto, shot) {
    const low = text.toLowerCase(), out = [];
    if (shot) out.push('overheard');
    if (tag && PHOTO_TOPIC[tag]) out.push(PHOTO_TOPIC[tag]);
    TOPICS.forEach(([k, rx]) => { if (rx.test(low) && !out.includes(k)) out.push(k); });
    if (hasPhoto && !out.length) out.push('photo');
    if (!out.length) out.push('generic');
    return out;
  }

  // ---------- tone, quoting back, and memory ----------
  // Insults are scored rather than matched by one pattern: hard insults count on their own, soft words
  // ("hate", "boring", "sucks") only when aimed at someone, and swearing or a brush-off always counts.
  const HARD_INSULT = /\b(stupid|dumb(est)?|idiot(ic|s)?|moron|fool|clown|loser|trash|garbage|pathetic|ugly|disgusting|weirdo|freak|creep|jerk|fraud|bozo|dork|dweeb|worthless|irrelevant|delusional|clueless|npc|try-?hard|embarrassing|gross)\b/;
  const SOFT_INSULT = /\b(hate|worst|terrible|awful|boring|annoying|irritating|sucks?|stinks?|mid|lame|cringe|useless|fake|nasty|flop|joke)\b/;
  const SWEAR = /\b(f+u+c+k\w*|fk|f off|wtf|shit\w*|bitch\w*|ass(hole)?s?|bastard|dick|piss off|stfu|gtfo)\b/;
  const DISMISS = /(shut up|go away|get lost|nobody asked|who asked|didn'?t ask|nobody cares|who cares|cry about it|go cry|touch grass|delete (your|ur) account|log off|stop posting|be quiet|get a life|do better|(nobody|no one) likes you|you'?re a joke|what a joke|blocked lol|l \+ ratio|\b(terrible|awful|bad|worst|dumb|stupid) take|\bkys\b|kill (yourself|urself))/;
  const AT_YOU = /\b(you|u|ur|your|yours|you'?re|youre|ya)\b|@\w/;
  // `directed` is true for replies and DMs (already aimed at someone); posts need a "you" or an @mention.
  function hostility(text, directed) {
    const low = text.toLowerCase(), aimed = directed || AT_YOU.test(low);
    const sw = low.match(SWEAR), hard = low.match(HARD_INSULT), soft = low.match(SOFT_INSULT), d = low.match(DISMISS);
    // a soft word in a reply counts when it is the whole reply ("cringe") or names a person ("worst person here")
    const softAimed = soft && (AT_YOU.test(low) || (directed && (low.trim().split(/\s+/).length <= 2 || /\b(person|account|post|take|human|guy|dude|bro)\b/.test(low))));
    let score = (sw ? 3 : 0) + (d ? 3 : 0) + (hard ? 2 : 0) + (softAimed ? 2 : 0);
    if (!aimed && !d && !sw) score = 0;
    const word = d ? d[0].trim() : hard ? hard[1] : softAimed ? soft[1] : null;
    return { insult: score >= 2, harsh: !!sw || /\bkys\b|kill (yourself|urself)/.test(low) || score >= 6, word };
  }
  const TONE_RX = {
    snark: /(thanks for nothing|wow,? (you'?re|ur|youre) so (smart|funny|original|cool|deep)|sure,? jan|ok boomer|\bimagine\b|\bcope\b|seethe|\bmid\b|bro thinks|nobody cares|cool story|yeah right|groundbreaking|riveting|thanks for the update|\bas if\b|\/s\b|🙄|💀|\blol ok\b|\bok and\b|^k\.?$|wow,? (great|amazing|incredible)|big if true|nice try|sure buddy|ok buddy|real original)/,
    rage: /(objectively|worst .{0,24}ever|overrated|fight me|change my mind|hot take|unpopular opinion|is a scam|should be illegal|nobody likes|everyone who|if you .{0,30} you('re| are)|i said what i said|ratio|\bfraud)/,
    nice: /(love (this|you|it|that|your)|so cute|amazing|proud of you|you'?re the best|thank you|\bthanks\b|great job|beautiful|wholesome|congrats|❤|🥰|😊|💕|you rock|so kind|appreciate|well done|you got this|truce|sorry|my bad|apolog|you'?re (great|awesome|right|funny)|fair point|good point|no hard feelings)/
  };
  function detectTone(text, directed) {
    const low = text.toLowerCase(), letters = text.replace(/[^a-zA-Z]/g, '');
    const caps = letters.length > 12 && letters.replace(/[^A-Z]/g, '').length / letters.length > 0.6;
    if (/thanks for nothing|so (smart|funny|original|cool|deep)\b/.test(low) && !hostility(text, directed).insult) return 'snark';
    if (hostility(text, directed).insult) return 'insult';
    if (caps || TONE_RX.rage.test(low)) return 'rage';
    if (TONE_RX.snark.test(low)) return 'snark';
    if (TONE_RX.nice.test(low)) return 'nice';
    return null;
  }
  // A short piece of the player's post that replies can quote back, or null when nothing reads well.
  function echoOf(text) {
    let s = text.trim();
    const q = s.match(/["“]([^"”]{3,60})["”]/), take = s.match(/(?:hot take|unpopular opinion|controversial opinion)\s*[:\-]?\s*(.+)/i);
    if (q) s = q[1]; else if (take) s = take[1];
    s = s.replace(/https?:\S+/g, '').replace(/[@#][\w.]+/g, '').replace(/\s+/g, ' ').trim();
    let words = s.replace(/[.!?,;:]+$/, '').split(' ').filter(Boolean);
    if (words.length > 8) words = s.split(/[,.;!?]| but | and | because /i)[0].trim().split(' ').filter(Boolean);
    if (words.length < 2 || words.length > 8) return null;
    return words.join(' ').replace(/[.!?,;:]+$/, '').toLowerCase();
  }
  function bump(id, d) {
    if (!S.rel || !C[id] || id === 'overheard' || !d) return;
    S.rel[id] = clamp((S.rel[id] || 0) + d, -10, 10);
  }
  const relOf = id => (S.rel && S.rel[id]) || 0;
  const isBlocked = id => !!(S.blocked && S.blocked[id]);
  // What a character says back to an insult. Fighters clap back (often quoting you), gentle people get
  // hurt, brands go into PR mode, and once you pass their patience they block you.
  function reactToInsult(id, h) {
    const X = AM.REACT, c = C[id], kind = X.style[c.voice] || 'hurt';
    S.insults[id] = (S.insults[id] || 0) + (h.harsh ? 2 : 1);
    bump(id, h.harsh ? -5 : -3);
    const say = line => style(id, scrub(fill(String(line).replace(/\{insult\}/g, h.word || '').replace(/\{seat\}/g, S.player.seat))));
    if (S.insults[id] >= X.patience[kind]) { S.blocked[id] = true; S.argue[id] = 0; return { text: say(pick(X.block[kind])), block: true, kind: 'block' }; }
    if (h.harsh && Math.random() < 0.6) return { text: say(pick(X.harsh)), kind: 'harsh' };
    if (kind === 'clap') {
      if (h.word && Math.random() < 0.55) return { text: say(pickFresh(X.clapEcho, 'ce')), kind: 'clap' };
      return { text: say(pickTagged(T.escalate[Math.min(2, S.insults[id] - 1)], id) || 'Bold of you.'), kind: 'clap' };
    }
    if (kind === 'hurt') return { text: say(h.word && Math.random() < 0.35 ? pickFresh(X.hurtEcho, 'he') : pickTagged(X.hurt, id) || 'Okay. That hurt.'), kind };
    if (kind === 'bot') return { text: say(pickFresh(X.bot, 'bo')), kind };
    return { text: say(pickTagged(X[kind], id) || 'Noted.'), kind };
  }
  // Someone nearby sticks up for the person you insulted in public.
  function defenderFor(victim, used) {
    const pool = CAST.filter(c => c.id !== victim && !NO_REPLY.has(c.id) && !isBlocked(c.id) && !(used && used.has(c.id)) && ['wholesome', 'hype', 'artsy', 'pun'].includes(c.voice));
    if (!pool.length) return null;
    const by = pick(pool).id;
    bump(by, -1);
    return { by, text: style(by, scrub(fill(pickFresh(AM.REACT.defend, 'df').replace(/\{victim\}/g, first(C[victim].name))))) };
  }
  // ---------- on-device AI ----------
  // With the AI downloaded, the model writes a reply in the character's voice for the situation the rules
  // engine already chose (who answers, and whether they're hurt, clapping back or blocking you). The
  // pre-written line stays on the event as the fallback.
  const aiOn = () => !!(AM.AI && AM.AI.state === 'ready' && T && !W.kids);
  const AI_RULES = 'You write one short social media reply in character, set in a made-up city called Harbor City. ' +
    'Keep it under 35 words. Write only the reply itself: no quotation marks around it, no name label, no hashtags unless they fit the character. ' +
    'Keep it PG-13: no slurs, no sexual content, no threats. Never mention being an AI. ' +
    'Do not mention real people, celebrities, brands, apps, movies, shows, songs or news; invent local ones if you need them. ' +
    'Talk to the passenger as "you" or by their name, and never guess their gender. ' +
    'If anyone asks who runs the gossip account @overheard_hc, you do not know, and if they ask whether it is you, deny it.';
  const MOODS = {
    topic: 'Reply naturally to what they posted.',
    echo: 'Reply to what they posted, quoting a few of their words back.',
    snark: 'They were sarcastic. Be sarcastic right back.',
    rage: 'It is rage bait. Take the bait: be dramatically, comically outraged.',
    unbothered: 'It is rage bait. Stay calm and smug, completely unbothered.',
    pileon: 'Pile on with a playful roast, like everyone is dunking on it.',
    insult: 'They were rude. Roast them back, playfully.',
    nice: 'They were kind. Be warm back.',
    rival: 'You have a running rivalry with them. Needle them playfully.',
    friend: 'You are a big fan of theirs. Hype them up.',
    clap: 'That was an insult aimed at you. Clap back with a witty, playful roast. You can quote their insult.',
    hurt: 'That was an insult aimed at you and it hurt. Reply briefly, a little hurt but with dignity.',
    deflect: 'That was an insult aimed at you. Brush it off with a joke.',
    formal: 'That was an insult aimed at you. Reply coldly and briefly; you will not engage.',
    pr: 'That was an insult aimed at your brand. Reply in polite corporate social-media PR-speak.',
    bot: 'That was an insult aimed at you. Reply like an automated weather bot: deadpan and robotic.',
    harsh: 'That insult crossed a line. Tell them so, briefly.',
    block: 'You are done with them and about to block them. Write one short final line.',
    argue1: 'They are arguing with you. Fire back, mildly.',
    argue2: 'They keep arguing. Get more heated, theatrically.',
    argue3: 'They still keep arguing. Maximum theatrical drama.',
    exit: 'You are bowing out of this argument. Leave with a punchline.',
    makeup: 'After arguing, they made peace. Accept it, with a little attitude.',
    followup: 'They replied to you. Answer once more, briefly.',
    dm: 'Reply to their latest message.'
  };
  const aiPersona = id => { const c = C[id]; return `You are ${c.name} (@${c.handle}). Bio: ${c.bio}. How you write: ${c.style}`; };
  const quoteIt = s => '"' + String(s || '').replace(/\s+/g, ' ').trim().slice(0, 280) + '"';
  function aiTask(kind, x) {
    const who = `${S.player.name} (@${S.player.handle}), a passenger on a flight`;
    const mood = MOODS[kind] || MOODS.topic;
    if (x.dm) return `Your private messages with ${who}, oldest first:\n${x.dm}\n${mood}`;
    if (x.victim) return `${who} just insulted ${x.victim} in public: ${quoteIt(x.text)}. Stand up for ${x.victim} in one short reply aimed at them.`;
    if (x.prev) return `You said: ${quoteIt(x.prev)}. ${who} answered: ${quoteIt(x.text)}. ${mood}`;
    return `${who} posted: ${quoteIt(x.text || '(just a photo)')}${x.photo ? ` They attached a photo of ${x.photo}.` : ''} ${mood}`;
  }
  const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\  // A line from a [tag, text] pool that this character could say: their own lines, then their voice.');
  const AI_BAD = /\b(as an ai|language model|i can'?t (help|assist|do that)|i cannot|i'?m sorry,? but|n+[i1]+g+|f+a+g+|r+e+t+a+r+d|sex\w*|porn\w*|nude|rape|suicid\w*|kill (yourself|urself|you)|kys)\b|<\||\[\/?inst/i;
  // Small models sometimes drift into real platforms or leak code-like junk; those lines fall back.
  const AI_OFFWORLD = /\b(twitter|tweet\w*|instagram|tiktok|facebook|reddit|youtube|snapchat|google|amazon|netflix|chatgpt|openai|x\.com)\b|[{}<>\\|`]|\)\)|'\)|https?:/i;
  function aiClean(raw, id) {
    const c = C[id];
    // keep the first non-empty line only: anything after a line break is the model wandering off
    let t = String(raw || '').split(/\n+/).map(x => x.trim()).filter(Boolean)[0] || '';
    t = t.replace(/\s+/g, ' ').trim();
    t = t.replace(new RegExp('^(' + reEsc(c.name) + '|@?' + reEsc(c.handle) + ')\\s*:\\s*', 'i'), '');
    t = t.replace(/(\s#\w+){2,}\s*$/, '').trim(); // a pile of hashtags at the end
    t = t.replace(/^(me|you|them|reply|response|answer)\s*:\s*/i, '');
    t = t.replace(/^["“”'‘’]+|["“”'‘’]+$/g, '').trim();
    if (t.length > 240) {
      const cut = t.slice(0, 240), end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
      t = end > 60 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, '') + '…';
    }
    if (t.length < 2 || AI_BAD.test(t) || AI_OFFWORLD.test(t) || (t.match(/#/g) || []).length > 2) return null;
    return t;
  }
  // Hands an event to the AI. `e.ai` is 1 while it writes, 2 when its line replaced the fallback, 3 when the
  // fallback stays (too slow, filtered, or failed).
  function aiAttach(e, id, kind, x, priority) {
    if (!aiOn() || !C[id] || id === 'overheard') return e;
    e.ai = 1;
    AM.AI.write([{ role: 'system', content: AI_RULES + '\n' + aiPersona(id) }, { role: 'user', content: aiTask(kind, x || {}) }],
      { priority: priority || 1, stale: () => e.ai !== 1 })
      .then(raw => { const t = aiClean(raw, id); if (t) { e.text = style(id, scrub(t)); e.styled = true; e.ai = 2; } else e.ai = 3; })
      .catch(() => { e.ai = 3; });
    return e;
  }
  const photoOf = p => (!p.photo ? null : p.drawing ? 'their own drawing'
    : { view: 'the view out the plane window', food: 'some food', pet: 'a pet', selfie: 'themselves', plane: 'the plane' }[p.topics[0]] || 'something');
  // The last few DM lines, written from the character's side.
  function dmHistory(who) {
    return (S.dms[who] ? S.dms[who].msgs : []).filter(m => m.from !== 'sys' && m.kind !== 'shot').slice(-6)
      .map(m => (m.from === 'me' ? 'Them: ' : 'You: ') + String(m.text).slice(0, 200)).join('\n');
  }
  // A line from a [tag, text] pool that this character could say: their own lines, then their voice.
  function pickTagged(pool, id) {
    if (!pool || !pool.length || !C[id]) return null;
    const v = C[id].voice;
    let opts = pool.filter(([g, x]) => (g === id || g === v) && !S.usedLines[AM.hash(x)]);
    if (!opts.length) opts = pool.filter(([g]) => g === id || g === v);
    if (!opts.length) opts = pool.filter(([g]) => !C[g]);
    if (!opts.length) return null;
    const x = pick(opts)[1];
    S.usedLines[AM.hash(x)] = 1;
    return x;
  }
  const poolFor = tp => (tp === 'generic' ? R.generic : R.topics[tp]) || [];
  function authorsFor(tag, used) {
    if (C[tag]) return !used.has(tag) && !NO_REPLY.has(tag) && !isBlocked(tag) ? [tag] : [];
    return CAST.filter(c => c.voice === tag && !used.has(c.id) && !NO_REPLY.has(c.id) && !isBlocked(c.id)).map(c => c.id);
  }
  function lineFor(id, topics, tone) {
    const v = C[id].voice;
    if (T && tone) { const x = pickTagged(T[tone], id); if (x) return x; }
    for (const tp of topics.concat('generic')) {
      const opts = poolFor(tp).filter(([g, x]) => (g === id || g === v) && !S.usedLines[AM.hash(x)]);
      if (opts.length) { const x = pick(opts)[1]; S.usedLines[AM.hash(x)] = 1; return x; }
    }
    return pick(R.followup[v] || ['👀']);
  }
  function drawFrom(pool, used, extra) {
    for (let k = 0; k < 24; k++) {
      const [tag, text] = pick(pool);
      if (S.usedLines[AM.hash(text)] && k < 16) continue;
      const authors = authorsFor(tag, used);
      if (!authors.length) continue;
      const by = pick(authors);
      used.add(by); S.usedLines[AM.hash(text)] = 1;
      return { by, text: extra ? fill(text, extra) : text };
    }
    return null;
  }
  // How replies split when a post has a tone: rage bait gets people taking the bait, the unbothered and a pile-on.
  const TONE_MIX = { rage: [['rage', 0.45], ['unbothered', 0.2], ['pileon', 0.2]], snark: [['snark', 0.6], ['pileon', 0.1]],
    insult: [['insult', 0.6], ['pileon', 0.15]], nice: [['nice', 0.6]] };
  function buildReplies(p, n) {
    const used = new Set(), out = [];
    p.mentions.forEach(id => {
      if (out.length >= n || used.has(id) || NO_REPLY.has(id) || isBlocked(id)) return;
      used.add(id);
      if (T && AM.REACT && p.tone === 'insult') {
        const r = reactToInsult(id, p.hostile || { word: null });
        out.push({ by: id, text: r.text, done: true, block: r.block, mood: r.kind });
        if (Math.random() < 0.55) { const dfd = defenderFor(id, used); if (dfd) { used.add(dfd.by); out.push(Object.assign(dfd, { done: true, victim: id })); } }
      } else out.push({ by: id, text: lineFor(id, p.topics, p.tone), mood: p.tone || 'topic' });
    });
    if (p.topics.includes('overheard') && !S.revealT && progress(now()) > 0.08 && Math.random() < 0.5) { used.add('overheard'); out.push({ by: 'overheard', text: pick(ST.overheardReplies || ['👀']) }); }
    if (T) {
      // People with history show up first: rivals to needle you, friends to back you up.
      shuffle(Object.keys(S.rel || {})).forEach(id => {
        if (out.length >= n || used.has(id) || NO_REPLY.has(id) || !C[id]) return;
        const pool = relOf(id) <= -4 ? T.rivalReply : relOf(id) >= 4 ? T.friendReply : null;
        if (pool && Math.random() < 0.7) { const line = pickTagged(pool, id); if (line) { used.add(id); out.push({ by: id, text: line, mood: relOf(id) <= -4 ? 'rival' : 'friend' }); } }
      });
      if (p.echo && out.length < n && Math.random() < 0.6) {
        const o = drawFrom(T.echo[p.tone === 'insult' ? 'snark' : p.tone || 'neutral'] || T.echo.neutral, used, { echo: p.echo });
        if (o) out.push(Object.assign(o, { mood: 'echo' }));
      }
    }
    let guard = 0;
    while (out.length < n && guard++ < 140) {
      let pool = null, mood = 'topic';
      if (T && p.tone && guard < 70) {
        let roll = Math.random();
        for (const [k, w] of TONE_MIX[p.tone]) { if (roll < w) { pool = T[k]; mood = k; break; } roll -= w; }
      }
      if (!pool) {
        const tp = guard > 70 ? 'generic' : (Math.random() < 0.72 || p.topics.length === 1) ? p.topics[0] : pick(p.topics.slice(1).concat('generic'));
        pool = poolFor(tp);
      }
      if (!pool || !pool.length) continue;
      const o = drawFrom(pool, used);
      if (o) out.push(Object.assign(o, { mood }));
    }
    return out.map(o => (o.done ? o : { by: o.by, text: style(o.by, scrub(fill(o.text))), mood: o.mood }));
  }
  function playerPost(o) {
    const t = now(), id = 'me' + (++S.seq), text = (o.text || '').trim();
    const topics = classify(text, o.tag, !!o.photo, !!o.shot);
    const tone = T ? detectTone(text) : null, echo = T ? echoOf(text) : null;
    const mentions = (text.match(/@([a-z0-9_.]+)/gi) || [])
      .map(m => CAST.find(c => c.handle.toLowerCase() === m.slice(1).toLowerCase().replace(/\.$/, ''))).filter(Boolean).map(c => c.id);
    const hostile = T ? hostility(text, false) : null;
    if (tone && tone !== 'insult') mentions.forEach(id => bump(id, { rage: -2, snark: -2, nice: 2 }[tone]));
    const F = followersNow(t);
    let likes = Math.pow(Math.max(F, 10), 0.78) * rand(0.2, 1.2), mult = 1;
    if (o.photo) mult *= 1.5;
    if (topics.includes('hottake') || tone === 'rage') mult *= 1.35;
    if (topics.includes('overheard') && progress(t) > 0.08) mult *= 1.6;
    if (topics.includes('achievement')) mult *= 1.3;
    if (topics.includes('sad')) mult *= 1.15;
    if (!S.stats.posts) mult *= 1.4;
    let viralChance = 0.06 + (o.photo ? 0.04 : 0) + (topics.includes('overheard') ? 0.1 : 0) + (topics.includes('hottake') || tone === 'rage' ? 0.05 : 0);
    if (!S.stats.posts || W.kids) viralChance = 0;
    const viral = o.forced === 'leak' || Math.random() < viralChance;
    likes *= mult;
    if (viral) likes *= o.forced === 'leak' ? 40 : rand(12, 30);
    if (o.forced === 'leak') likes = Math.max(likes, 4000);
    likes = Math.max(2, Math.round(likes));
    const gain = Math.round(likes * 0.6 * Math.pow(Math.max(F, 10), -0.15) * (viral ? 1.5 : 1));
    const tau = clamp(S.flight.duration * 0.03, 25000, 12 * MIN) * (viral ? 1.6 : 1);
    const p = { id, by: 'me', t, text, photo: o.photo || null, drawing: !!o.drawing, shot: !!o.shot, likes, gain, tau, topics, tone, echo, mentions, viral, hostile,
      replies: [], ms: 0, seed: AM.hash(id + ':' + S.flight.seed), tags: [] };
    addPost(p);
    S.mine.push(id);
    S.stats.posts++;
    S.revealedUntil = Math.max(S.revealedUntil, t);
    scheduleReactions(p);
    saveSoon();
    return p;
  }
  function scheduleReactions(p) {
    const tier = S.player.tier;
    const n = (tier === 'nobody' ? 2 : tier === 'rising' ? 3 : 4) + Math.floor(Math.random() * 3) + (p.viral ? 2 : 0);
    const reps = buildReplies(p, n);
    const ratioIdx = !W.kids && (p.topics.includes('hottake') || p.tone === 'rage' || p.tone === 'insult') && Math.random() < 0.45
      ? reps.findIndex(x => x.by !== 'overheard' && ['contrarian', 'snark', 'chaos'].includes(C[x.by].voice)) : -1;
    let t = p.t + rand(5000, 11000);
    reps.forEach((rp, i) => {
      const likes = i === ratioIdx ? Math.round(p.likes * rand(1.3, 2.2)) : Math.round(p.likes * rand(0.01, 0.12) + Math.random() * 4);
      schedule(aiAttach({ t, kind: 'reply', post: p.id, by: rp.by, text: rp.text, likes, ratio: i === ratioIdx }, rp.by,
        rp.victim ? 'defend' : rp.mood || 'topic', { text: p.text, photo: photoOf(p), victim: rp.victim ? first(C[rp.victim].name) : null }, 2));
      if (rp.block) schedule({ t: t + 900, kind: 'block', who: rp.by });
      t += rand(6000, 20000) * (1 + i * 0.3);
    });
    if (p.viral) {
      const quoters = shuffle(CAST.filter(c => !NO_REPLY.has(c.id) && !reps.some(x => x.by === c.id)).map(c => c.id)).slice(0, 3);
      quoters.forEach((q, i) => schedule({ t: p.t + rand(25000, 50000) + i * rand(15000, 35000), kind: 'quote', post: p.id, by: q }));
      schedule({ t: p.t + rand(14000, 24000), kind: 'notif', n: { type: 'viral', html: p.shot ? `Your post is blowing up. Half of ${esc(ST.world.name)} has seen it.` : '<b>Your post is going viral.</b> Buckle up.', go: { post: p.id } } });
    }
  }
  function sendReply(postId, text, toRid) {
    const p = postIndex.get(postId);
    if (!p) return;
    const r = { id: 'mr' + (++S.seq), by: 'me', text, t: now(), likes: 0, to: toRid || null };
    p.replies.push(r);
    const myReply = r;
    let target = toRid ? (p.replies.find(x => x.id === toRid) || {}).by : p.by;
    if (target === 'me') { const others = p.replies.filter(x => x.by !== 'me'); target = others.length ? pick(others).by : null; }
    const tone = T ? detectTone(text, true) : null;
    // what the target said that the player is answering
    const theirs = toRid ? (p.replies.find(x => x.id === toRid) || {}).text : p.by === target ? p.text : null;
    if (target && target !== 'me' && target !== 'overheard' && T && AM.REACT && tone === 'insult' && !isBlocked(target)) {
      const re = reactToInsult(target, hostility(text, true)), at = now() + rand(2500, 6500);
      schedule(aiAttach({ t: at, kind: 'reply', post: postId, by: target, text: re.text, to: myReply.id }, target, re.kind, { prev: theirs, text }, 3));
      if (re.block) schedule({ t: at + 900, kind: 'block', who: target });
      else if (Math.random() < 0.5) {
        const dfd = defenderFor(target);
        if (dfd) schedule(aiAttach({ t: at + rand(4000, 9000), kind: 'reply', post: postId, by: dfd.by, text: dfd.text, to: myReply.id }, dfd.by, 'defend', { victim: first(C[target].name), text }, 2));
      }
      saveSoon();
      return;
    }
    if (target && isBlocked(target)) { saveSoon(); return; }
    if (target && target !== 'me' && target !== 'overheard' && T && (tone === 'snark' || tone === 'rage' || (tone === 'nice' && (S.argue[target] || relOf(target) <= -4)))) {
      // An argument: the character escalates for three rounds, then exits. Being nice ends it.
      const round = S.argue[target] || 0;
      let pool, mood;
      if (tone === 'nice') { pool = T.makeup; mood = 'makeup'; S.argue[target] = 0; bump(target, 5); }
      else if (round >= 3) { pool = T.exit; mood = 'exit'; S.argue[target] = 0; bump(target, -1); }
      else { pool = T.escalate[round]; mood = 'argue' + (round + 1); S.argue[target] = round + 1; bump(target, tone === 'insult' ? -3 : -2); }
      const line = pickTagged(pool, target);
      if (line) schedule(aiAttach({ t: now() + rand(3000, 8000), kind: 'reply', post: postId, by: target, text: style(target, scrub(fill(line))), to: r.id }, target, mood, { prev: theirs, text }, 3));
      saveSoon();
      return;
    }
    if (target && tone === 'nice') bump(target, 2);
    if (target && target !== 'me' && Math.random() < (toRid ? 0.9 : 0.7)) {
      const line = target === 'overheard' ? pick(S.revealT ? (ST.overheardRetired || ST.overheardReplies) : ST.overheardReplies) : pickFresh(R.followup[C[target].voice] || ['fair enough'], 'fu' + target);
      schedule(aiAttach({ t: now() + rand(4000, 12000), kind: 'reply', post: postId, by: target, text: style(target, scrub(fill(line))), to: r.id }, target, tone === 'nice' ? 'nice' : 'followup', { prev: theirs, text }, 3));
      if (Math.random() < 0.5) schedule({ t: now() + rand(2500, 8000), kind: 'likeReply', post: postId, rid: r.id, by: target });
    }
    saveSoon();
  }

  // ---------- rendering: shell ----------
  function buildShell() {
    $('#app').innerHTML = `
      <header class="topbar">
        <button class="icon-btn" data-act="profile" data-who="me" aria-label="Your profile" id="me-btn"></button>
        <div class="wordmark"><span class="glyph">${I.planeUp}</span><span class="wm-text">Airplane Mode</span></div>
        <div class="top-right"><button class="icon-btn bell" data-act="tab" data-tab="activity" aria-label="Activity">${I.bell}<i class="dot" id="dot-activity" hidden></i></button>
          <button class="icon-btn" data-act="settings" aria-label="Settings">${I.gear}</button></div>
      </header>
      <div class="strip" id="strip" data-act="strip" role="button" tabindex="0" aria-label="Flight details">
        <div class="strip-route"><span id="s-from"></span><div class="strip-track"><div class="strip-done" id="s-done"></div><div class="strip-plane" id="s-plane">${I.planeRight}</div></div><span id="s-to"></span></div>
        <div class="strip-meta"><span id="s-phase"></span><span id="s-left"></span></div>
        <div class="strip-more" id="s-more" hidden>
          <div>Altitude<b id="s-alt"></b></div><div>Speed<b id="s-spd"></b></div><div>Outside<b id="s-tmp"></b></div><div>Elapsed<b id="s-el"></b></div>
        </div>
      </div>
      <div class="views" id="views">
        <section class="view" id="v-home" aria-label="Home feed"><div class="feed-tools" id="algo" role="group" aria-label="Your algorithm"></div><div id="feed"></div></section>
        <section class="view" id="v-explore" hidden aria-label="Explore">
          <label class="search">${I.search}<input id="q" type="search" placeholder="Search" autocomplete="off" aria-label="Search"></label>
          <div id="explore-body"></div>
        </section>
        <section class="view learn" id="v-learn" hidden aria-label="Learn"><div class="learn-cats" id="learn-cats" role="group" aria-label="Topics"></div><div class="learn-deck" id="learn-deck"></div></section>
        <section class="view" id="v-activity" hidden aria-label="Activity"><div class="view-title">Activity</div><div id="activity-body"></div></section>
        <section class="view" id="v-messages" hidden aria-label="Messages"><div class="view-title">Messages</div><div id="messages-body"></div></section>
        <div id="pill-slot"></div>
      </div>
      <nav class="tabbar" aria-label="Main">
        <button class="tab" data-act="tab" data-tab="home" aria-label="Home">${I.home}</button>
        <button class="tab" data-act="tab" data-tab="explore" aria-label="Explore">${I.search}</button>
        <button class="tab tab-post" data-act="compose" aria-label="New post"><span>${I.plus}</span></button>
        <button class="tab" data-act="tab" data-tab="learn" aria-label="Learn">${I.bulb}</button>
        <button class="tab" data-act="tab" data-tab="messages" aria-label="Messages">${I.mail}<i class="dot" id="dot-messages" hidden></i></button>
      </nav>
      <div id="pages"></div><div id="overlay"></div>`;
    $('#q').addEventListener('input', e => { ui.query = e.target.value; renderExplore(); });
    let seenTimer = 0;
    $('#learn-deck').addEventListener('scroll', () => { clearTimeout(seenTimer); seenTimer = setTimeout(markSeen, 350); }, { passive: true });
  }
  function renderAll() {
    $('#me-btn').innerHTML = avatarHTML('me', 'sm', false);
    $('#s-from').textContent = S.player.from;
    $('#s-to').textContent = S.player.to;
    $('#q').placeholder = 'Search ' + ST.world.name;
    $('#app').classList.toggle('kids', W.kids);
    ui.learnKey = '';
    renderAlgo();
    renderHome(true);
    setTab(ui.tab);
    updateStrip(now()); updateBadges();
  }
  function renderAlgo() {
    $('#algo').innerHTML = (W.kids ? [] : ALGOS).map(([k, label]) => `<button class="chip" data-act="algo" data-v="${k}" aria-pressed="${S.algo === k}">${label}</button>`).join('') +
      `<span class="chip soft" aria-hidden="true">${esc(S.flight.no)} · Seat ${esc(S.player.seat)}</span>`;
  }
  function setTab(tab) {
    ui.tab = tab;
    ['home', 'explore', 'learn', 'activity', 'messages'].forEach(k => { $('#v-' + k).hidden = k !== tab; });
    $$('[data-act="tab"][data-tab]').forEach(b => { if (b.dataset.tab === tab) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    if (tab === 'learn') renderLearn();
    if (tab === 'activity') { ui.activitySeen = S.seenNotifT; S.seenNotifT = now(); renderActivity(); }
    if (tab === 'explore') renderExplore();
    if (tab === 'messages') renderMessages();
    updateNewPill(now()); updateBadges();
  }

  // ---------- rendering: pieces ----------
  function avatarHTML(id, cls = '', act = true) {
    const a = author(id), face = !W.kids && id !== 'me' && AM.face ? AM.face(id, a.hue) : null;
    return `<span class="av ${cls}${a.anon ? ' anon' : ''}${face ? ' face' : ''}" style="--h:${a.hue}"${act ? ` data-act="profile" data-who="${id}"` : ''} aria-hidden="true">${face ? `<img src="${face}" alt="">` : a.emoji}</span>`;
  }
  const verHTML = a => (a.verified ? `<span class="badge-ver">${I.verified}</span>` : '');
  function richText(s) {
    return esc(s)
      .replace(/(^|[^\w&])@([a-z0-9_.]*[a-z0-9_])/gi, (m, pre, h) => {
        const c = CAST.find(x => x.handle.toLowerCase() === h.toLowerCase());
        const isMe = h.toLowerCase() === S.player.handle.toLowerCase();
        return pre + (c ? `<span class="mention" data-act="profile" data-who="${c.id}">@${h}</span>` : isMe ? `<span class="mention" data-act="profile" data-who="me">@${h}</span>` : '@' + h);
      })
      .replace(/(^|\s)#(\w+)/g, (m, pre, tag) => `${pre}<span class="tag" data-act="search" data-q="${tag}">#${tag}</span>`);
  }
  function shotHTML() {
    return `<div class="shot" aria-label="Screenshot of a text message"><div class="shot-top"><span>11:52 PM</span><span>Messages</span></div>
      <div class="shot-from">${esc(ST.leak.from)}</div><div class="shot-msg">${esc(ST.leak.text)}</div><span class="shot-blur"></span></div>`;
  }
  function mediaHTML(p) {
    if (p.photo) return `<div class="post-media user"><img src="${p.photo}" alt="Photo"></div>`;
    if (p.photoGone) return `<div class="post-media"><div class="empty">Photo cleared to save space</div></div>`;
    if (p.scene) return `<div class="post-media"><img loading="lazy" src="${AM.art(p.scene, p.seed)}" alt=""></div>`;
    if (p.shot) return shotHTML();
    return '';
  }
  function pollHTML(p) {
    const t = now();
    let mine = S.polls[p.id];
    if (p.pollId === 'accuse' && S.accuse) mine = SUSPECTS.indexOf(S.accuse.id);
    const closed = (p.pollId === 'game' && progress(t) >= ST.game.closesAt) || (p.pollId === 'accuse' && !!S.revealT);
    const r = AM.rng(p.seed ^ 0x9e3779b9), w = p.poll.map(() => 0.4 + r()), total = w.reduce((a, b) => a + b, 0);
    const votes = Math.max(12, Math.round(likesNow(p, t) * 1.3));
    const results = mine != null || closed;
    const opts = p.poll.map((opt, i) => {
      const pct = Math.round((w[i] / total) * 100);
      return results
        ? `<div class="poll-opt${mine === i ? ' mine' : ''}"><span class="bar" style="width:${pct}%"></span><span>${esc(opt)}${mine === i ? ' · your pick' : ''}</span><span class="pct">${pct}%</span></div>`
        : `<button class="poll-opt" data-act="poll" data-id="${p.id}" data-i="${i}"><span>${esc(opt)}</span></button>`;
    }).join('');
    return `<div class="poll">${opts}<div class="poll-meta">${fmtNum(votes)} votes · ${closed ? 'Final results' : results ? 'You voted' : 'Tap to vote'}</div></div>`;
  }
  function quoteCardHTML(qid) {
    const q = postIndex.get(qid);
    if (!q) return '';
    const a = author(q.by);
    return `<div class="quote-card" data-act="open-post" data-id="${q.id}"><div class="post-head">${avatarHTML(q.by, 'xs', false)}<span class="name">${esc(a.name)}</span><span class="handle">@${esc(a.handle)}</span></div>
      <div class="post-text">${esc(trimText(q.text || (q.shot ? 'Screenshot' : 'Photo'), 160))}</div>${q.shot ? '<div class="quote-note">Screenshot attached</div>' : ''}</div>`;
  }
  function actionsHTML(p, t) {
    if (W.kids) {
      return `<div class="actions kid-actions"><button class="act reply" data-act="reply" data-id="${p.id}" aria-label="Reply">${I.reply}<span>Reply</span></button>
        <button class="act star${S.liked[p.id] ? ' on' : ''}" data-act="like" data-id="${p.id}" aria-label="Give a star">${I.star}<span>${S.liked[p.id] ? 'Starred' : 'Star'}</span></button></div>`;
    }
    return `<div class="actions">
      <button class="act reply" data-act="reply" data-id="${p.id}" aria-label="Reply">${I.reply}<span data-k="r">${countText(repliesNow(p, t))}</span></button>
      <button class="act repost${S.reposted[p.id] ? ' on' : ''}" data-act="repost" data-id="${p.id}" aria-label="Repost">${I.repost}<span data-k="rp">${countText(repostsNow(p, t))}</span></button>
      <button class="act like${S.liked[p.id] ? ' on' : ''}" data-act="like" data-id="${p.id}" aria-label="Like">${I.heart}<span data-k="l">${countText(likesNow(p, t))}</span></button>
      <span class="act" aria-label="Views">${I.views}<span data-k="v">${countText(viewsNow(p, t))}</span></span></div>`;
  }
  function headHTML(p, t) {
    const a = author(p.by);
    const live = p.live && progress(t) < 0.61 ? '<span class="live-pill">LIVE</span>' : '';
    return `<div class="post-head"><span class="name" data-act="profile" data-who="${p.by}">${esc(a.name)}</span>${verHTML(a)}<span class="handle">@${esc(a.handle)}</span><span class="time">· <span data-ts="${p.t}">${fmtAgo(t - p.t)}</span></span>${live}</div>`;
  }
  function postHTML(p, fresh) {
    const t = now();
    return `<article class="post${p.by === 'me' ? ' mine' : ''}${fresh ? ' fresh' : ''}" data-act="open-post" data-id="${p.id}" data-pid="${p.id}">
      ${avatarHTML(p.by)}
      <div class="post-body">${headHTML(p, t)}
        ${p.text ? `<div class="post-text">${richText(p.text)}</div>` : ''}${mediaHTML(p)}${p.poll ? pollHTML(p) : ''}${p.quoteOf ? quoteCardHTML(p.quoteOf) : ''}
        ${p.learnId ? `<button class="chip soft learn-link" data-act="tab" data-tab="learn">${I.bulb}More in Learn</button>` : ''}
        ${actionsHTML(p, t)}</div></article>`;
  }

  // ---------- home ----------
  function renderHome(force) {
    const vis = S.posts.filter(p => p.t <= S.revealedUntil);
    const key = S.revealedUntil + ':' + vis.length;
    if (!force && key === ui.homeKey) return;
    ui.homeKey = key;
    const list = vis.slice(-240).reverse();
    $('#feed').innerHTML = list.length ? list.map(p => postHTML(p, ui.prevRevealed && p.t > ui.prevRevealed)).join('')
      : '<div class="empty"><b>Your feed is warming up</b>New posts land every few minutes.</div>';
  }
  function updateNewPill(t) {
    const slot = $('#pill-slot');
    if (!slot) return;
    const pending = S.posts.filter(p => p.t > S.revealedUntil && p.t <= t && p.by !== 'me');
    if (!pending.length || ui.tab !== 'home' || ui.stack.length) {
      if (ui.pillCount !== 0) { slot.innerHTML = ''; ui.pillCount = 0; }
      ui.pillSince = 0;
      return;
    }
    if (!ui.pillSince) ui.pillSince = Date.now();
    if ($('#v-home').scrollTop < 8 && Date.now() - ui.pillSince > 3500 && Date.now() - ui.lastTouch > 5000) { reveal(); return; }
    if (ui.pillCount === pending.length) return;
    ui.pillCount = pending.length;
    const who = [];
    pending.slice().reverse().forEach(p => { if (who.length < 3 && !who.includes(p.by)) who.push(p.by); });
    slot.innerHTML = `<button class="new-pill" data-act="reveal">${who.map(w => avatarHTML(w, 'xs', false)).join('')}<span>${pending.length} new post${pending.length > 1 ? 's' : ''}</span></button>`;
  }
  function reveal() {
    ui.prevRevealed = S.revealedUntil;
    S.revealedUntil = now();
    ui.pillSince = 0; ui.pillCount = -1;
    $('#pill-slot').innerHTML = '';
    renderHome(true);
    $('#v-home').scrollTop = 0;
    saveSoon();
  }

  function updateCounts(t) {
    const roots = [];
    const view = $('#v-' + ui.tab);
    if (view && ui.tab === 'home' && !ui.stack.length) roots.push(view);
    const top = ui.stack[ui.stack.length - 1];
    if (top && top.el) roots.push(top.el);
    roots.forEach(root => {
      $$('[data-pid]', root).forEach(el => {
        const p = postIndex.get(el.dataset.pid);
        if (!p) return;
        const vals = { l: likesNow(p, t), r: repliesNow(p, t), rp: repostsNow(p, t), v: viewsNow(p, t) };
        $$('[data-k]', el).forEach(s => {
          const k = s.dataset.k, txt = s.dataset.full ? fmtNum(vals[k]) : countText(vals[k]);
          if (s.textContent !== txt) s.textContent = txt;
        });
      });
      $$('[data-ts]', root).forEach(s => { const txt = fmtAgo(t - +s.dataset.ts); if (s.textContent !== txt) s.textContent = txt; });
    });
  }

  // ---------- seatback strip ----------
  function updateStrip(t) {
    const p = progress(t), f = S.flight;
    const phase = p >= 1 ? 'landed' : p < 0.06 ? 'climb' : p >= 0.88 ? 'descent' : 'cruise';
    const cruiseAlt = p > 0.5 ? 39000 : 37000;
    const alt = phase === 'climb' ? 37000 * ease(p / 0.06) : phase === 'cruise' ? cruiseAlt : phase === 'descent' ? 39000 * (1 - ease((p - 0.88) / 0.12)) : 0;
    const spd = phase === 'climb' ? 180 + 340 * ease(p / 0.06) : phase === 'cruise' ? 518 + Math.round(Math.sin(t / 60000) * 9) : phase === 'descent' ? 520 - 370 * ease((p - 0.88) / 0.12) : 0;
    const label = { climb: 'Climbing', cruise: 'Cruising', descent: 'Descending', landed: 'Landed' }[phase];
    $('#s-done').style.width = (p * 100).toFixed(2) + '%';
    $('#s-plane').style.left = (p * 100).toFixed(2) + '%';
    const belt = phase === 'climb' || phase === 'descent' ? `<span class="seatbelt">${I.seatbelt.replace('<svg', '<svg width="15" height="15"')}Seatbelt</span> · ` : '';
    const phaseHTML = phase === 'landed' ? '<b>Landed</b> · at the gate' : `${belt}<b>${label}</b> · ${fmtNum(Math.round(alt / 100) * 100).replace('K', ',000')} ft`;
    const left = phase === 'landed' ? (S.player.to && S.player.to !== 'AWAY' ? 'Welcome to ' + esc(S.player.to) : 'Welcome!') : `<b>${fmtDur(f.duration * (1 - p))}</b> to go`;
    if ($('#s-phase').innerHTML !== phaseHTML) $('#s-phase').innerHTML = phaseHTML;
    if ($('#s-left').innerHTML !== left) $('#s-left').innerHTML = left;
    if (ui.stripOpen) {
      $('#s-alt').textContent = Math.round(alt).toLocaleString() + ' ft';
      $('#s-spd').textContent = Math.round(spd) + ' mph';
      $('#s-tmp').textContent = Math.round(59 - alt * 0.00356) + '°F';
      $('#s-el').textContent = fmtDur(clamp(t - f.start, 0, f.duration));
    }
  }

  function updateBadges() {
    const n = S.notifs.filter(x => x.t > S.seenNotifT).length;
    if (ui.tab === 'activity' && n) { S.seenNotifT = now(); }
    const dn = Object.values(S.dms).filter(d => d.unread > 0 || d.choices).length;
    const da = $('#dot-activity'), dm = $('#dot-messages');
    const na = ui.tab === 'activity' ? 0 : n;
    da.hidden = !na; da.textContent = na > 99 ? '99+' : na;
    dm.hidden = !dn; dm.textContent = dn;
  }

  // ---------- explore ----------
  function trendList(t) {
    const p = progress(t), c = ctx();
    return ST.trends.filter(tr => p >= tr.from && (tr.to == null || p < tr.to) && (!tr.when || tr.when(S.flags)))
      .map(tr => {
        const tag = fill(tr.tag, c);
        const r = AM.rng(AM.hash(tag + S.flight.seed));
        return { tag, q: (ST.trendQ || {})[tr.tag] || 'overheard', count: Math.round(tr.base + tr.grow * ease((p - tr.from) / 0.3) * (0.8 + r() * 0.4)), story: tr.from > 0 };
      })
      .sort((a, b) => b.count - a.count).slice(0, 8);
  }
  function renderExplore() {
    const body = $('#explore-body'), t = now(), q = ui.query.trim().toLowerCase();
    if (q) {
      const alts = q.split('|').map(s => s.trim()).filter(Boolean);
      const hit = s => alts.some(a => s.toLowerCase().includes(a));
      const people = CAST.filter(c => hit(c.name) || hit(c.handle));
      const posts = S.posts.filter(p => p.t <= t && (hit(p.text || '') || (p.by !== 'me' && hit(C[p.by].handle)))).reverse().slice(0, 80);
      body.innerHTML = (people.length ? `<div class="section-label">People</div>` + people.map(whoHTML).join('') : '') +
        `<div class="section-label">Posts</div>` + (posts.length ? posts.map(p => postHTML(p)).join('') : `<div class="empty"><b>Nothing yet</b>Try another word, or wait. ${esc(ST.world.name)} posts a lot.</div>`);
      return;
    }
    const trends = trendList(t);
    const follow = shuffle(CAST.filter(c => !S.following[c.id] && c.id !== 'overheard'), AM.rng(S.flight.seed)).slice(0, 5);
    body.innerHTML = `<div class="section-label">Trending in ${esc(ST.world.name)}</div>` +
      trends.map((tr, i) => `<button class="trend" data-act="search" data-q="${esc(tr.q)}" data-label="${esc(tr.tag)}"><span class="rank">${i + 1}</span><span class="t-main"><small>${tr.story ? 'Trending now' : 'Trending'}</small><b>#${esc(tr.tag)}</b><small>${fmtNum(tr.count)} posts</small></span>${tr.story && i < 3 ? '<span class="hot">Hot</span>' : ''}</button>`).join('') +
      `<div class="section-label">Who to follow</div>` + follow.map(whoHTML).join('');
  }
  function whoHTML(c) {
    return `<button class="who" data-act="profile" data-who="${c.id}">${avatarHTML(c.id, '', false)}<span class="w-main"><b>${esc(c.name)}${verHTML(c)}</b><small>@${esc(c.handle)} · ${esc(trimText(c.bio, 60))}</small></span></button>`;
  }

  // ---------- activity ----------
  const N_ICON = { like: ['heart', 'ic-like'], reply: ['reply', 'ic-reply'], follow: ['follow', 'ic-follow'], repost: ['repost', 'ic-repost'],
    viral: ['flame', 'ic-like'], mystery: ['mystery', 'ic-mystery'], flight: ['planeUp', 'ic-flight'], game: ['trophy', 'ic-mystery'],
    beef: ['flame', 'ic-like'], star: ['star', 'ic-mystery'] };
  function renderActivity() {
    const t = now();
    const list = S.notifs.filter(n => n.t <= t).slice().reverse();
    $('#activity-body').innerHTML = list.length ? list.map(n => {
      const ic = N_ICON[n.type] || N_ICON.flight;
      return `<button class="notif${n.t > ui.activitySeen ? ' unread' : ''}" data-act="notif" data-id="${n.id}"><span class="n-icon ${ic[1]}">${I[ic[0]]}</span>
        <span class="n-main">${n.by && n.by.length ? `<span class="n-avs">${n.by.map(b => avatarHTML(b, 'xs', false)).join('')}</span>` : ''}
        <span class="n-text">${n.html} <span class="n-time">· ${fmtAgo(t - n.t)}</span></span>${n.quote ? `<span class="n-quote">${esc(n.quote)}</span>` : ''}</span></button>`;
    }).join('') : '<div class="empty"><b>Quiet up here</b>Post something and see who shows up.</div>';
  }

  // ---------- messages ----------
  function renderMessages() {
    const t = now();
    const convos = Object.keys(S.dms).filter(k => S.dms[k].msgs.length).sort((a, b) => lastT(b) - lastT(a));
    const starters = CAST.filter(c => !S.dms[c.id]).slice(0, 16);
    $('#messages-body').innerHTML =
      (convos.length ? convos.map(k => {
        const d = S.dms[k], m = d.msgs[d.msgs.length - 1], a = author(k);
        const prev = d.choices ? 'Waiting for your reply' : m.kind === 'shot' ? 'Sent a screenshot' : (m.from === 'me' ? 'You: ' : '') + m.text;
        const unread = d.unread > 0 || !!d.choices;
        return `<button class="convo${unread ? ' unread' : ''}" data-act="chat" data-who="${k}">${avatarHTML(k, '', false)}<span class="c-main"><b>${esc(a.name)}</b><small>${esc(prev)}</small></span>
          <span class="c-side"><span>${fmtAgo(t - m.t)}</span>${unread ? '<span class="c-dot"></span>' : ''}</span></button>`;
      }).join('') : '<div class="empty"><b>No messages yet</b>Characters will slide into your DMs. You can also start a chat below.</div>') +
      `<div class="section-label">Start a chat</div>` + starters.map(whoHTML).join('').replace(/data-act="profile"/g, 'data-act="chat"');
  }
  const lastT = k => { const m = S.dms[k].msgs; return m.length ? m[m.length - 1].t : 0; };

  // ---------- learn ----------
  // A swipe-through deck: one card per screen. The order is shuffled once per flight so it stays put.
  function learnDeck() {
    const all = (AM.LEARN || []).filter(c => !W.kids || c.kids);
    const deck = shuffle(all, AM.rng(S.flight.seed ^ 0x51ed));
    return ui.learnCat && ui.learnCat !== 'all' ? deck.filter(c => c.cat === ui.learnCat) : deck;
  }
  function renderLearn() {
    const key = W.kind + ':' + (ui.learnCat || 'all') + ':' + S.flight.seed;
    if (ui.learnKey === key) return;
    ui.learnKey = key;
    const cats = AM.LEARN_CATS || {};
    const avail = new Set((AM.LEARN || []).filter(c => !W.kids || c.kids).map(c => c.cat));
    $('#learn-cats').innerHTML = `<button class="chip" data-act="learn-cat" data-v="all" aria-pressed="${!ui.learnCat || ui.learnCat === 'all'}">All</button>` +
      Object.keys(cats).filter(k => avail.has(k)).map(k => `<button class="chip" data-act="learn-cat" data-v="${k}" aria-pressed="${ui.learnCat === k}">${esc(cats[k].label)}</button>`).join('');
    const deck = learnDeck(), box = $('#learn-deck');
    box.innerHTML = deck.length ? deck.map((c, i) => learnCardHTML(c, i, deck.length)).join('')
      : '<div class="empty"><b>The Learn deck is still being packed</b>Check back next flight.</div>';
    box.scrollTop = 0;
    markSeen();
  }
  function learnCardHTML(c, i, n) {
    const cat = (AM.LEARN_CATS || {})[c.cat] || { label: c.cat, hue: 210 };
    const state = S.learned[c.id];
    let body;
    if (c.type === 'quiz') {
      const ans = S.quiz[c.id], picked = (S.quizPick || {})[c.id];
      body = `<div class="lc-kicker">Quiz · ${esc(cat.label)}</div><h3 class="lc-title">${esc(c.q)}</h3>
        <div class="lc-options">${c.options.map((o, k) => {
          const cls = ans === undefined ? '' : k === c.answer ? ' right' : k === picked ? ' wrong' : ' dim';
          return `<button class="lc-opt${cls}" data-act="quiz" data-id="${c.id}" data-i="${k}"${ans !== undefined ? ' disabled' : ''}>${esc(o)}</button>`;
        }).join('')}</div>${ans !== undefined ? `<p class="lc-more"><b>${ans ? 'Yes!' : 'Not quite.'}</b> ${esc(c.explain)}</p>` : ''}`;
    } else if (c.type === 'myth') {
      const busted = state === 'busted';
      body = `<div class="lc-kicker">Myth or fact? · ${esc(cat.label)}</div><h3 class="lc-title lc-myth${busted ? ' struck' : ''}">${esc(c.myth)}</h3>
        ${busted ? `<p class="lc-fact"><b>Myth!</b> ${esc(W.kids && c.kid ? c.kid : c.truth)}</p>` : `<button class="lc-btn" data-act="bust" data-id="${c.id}">Bust it</button>`}`;
    } else {
      body = `<div class="lc-kicker">${esc(cat.label)}</div><h3 class="lc-title">${esc(c.title)}</h3><p class="lc-fact">${esc(W.kids && c.kid ? c.kid : c.fact)}</p>
        ${W.kids ? '' : state === 'more' ? `<p class="lc-more">${esc(c.more)}</p>` : `<button class="lc-btn" data-act="learn-more" data-id="${c.id}">Tell me more</button>`}`;
    }
    return `<article class="learn-card" data-lid="${c.id}" data-i="${i}" data-n="${n}" style="--h:${cat.hue}"><div class="lc-art" aria-hidden="true"><span>${c.emoji}</span></div>
      <div class="lc-body">${body}</div><div class="lc-foot"><span>${i ? 'Swipe for more' : 'Swipe up for more'}</span><span>${i + 1} / ${n}</span></div></article>`;
  }
  function rerenderCard(id) {
    const el = $(`.learn-card[data-lid="${id}"]`), c = (AM.LEARN || []).find(x => x.id === id);
    if (!el || !c) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = learnCardHTML(c, +el.dataset.i, +el.dataset.n).trim();
    el.replaceWith(tmp.firstChild);
  }
  // Every card you look at counts toward "things learned" in the recap.
  function markSeen() {
    const box = $('#learn-deck');
    if (!box || !box.clientHeight) return;
    const cards = box.querySelectorAll('.learn-card'), el = cards[Math.round(box.scrollTop / box.clientHeight)];
    if (el && !S.learned[el.dataset.lid]) { S.learned[el.dataset.lid] = 'seen'; saveSoon(); }
  }

  // ---------- pages ----------
  function pushPage(pg) {
    ui.stack.push(pg);
    pg.el = document.createElement('div');
    pg.el.className = 'page';
    $('#pages').appendChild(pg.el);
    renderPage(pg, true);
    updateNewPill(now());
  }
  function popPage() {
    const pg = ui.stack.pop();
    if (pg && pg.el) pg.el.remove();
    ui.replyTo = null;
    const top = ui.stack[ui.stack.length - 1];
    if (top) renderPage(top, false);
    else if (ui.tab === 'messages') renderMessages();
    updateBadges(); updateNewPill(now());
  }
  function refreshOpen() {
    const top = ui.stack[ui.stack.length - 1];
    if (top) renderPage(top, false);
    if (ui.tab === 'activity') renderActivity();
    if (ui.tab === 'messages' && !top) renderMessages();
    if (ui.tab === 'explore' && !top && !$('#q').matches(':focus')) renderExplore();
    renderHome(false);
  }
  function renderPage(pg, full) {
    if (pg.type === 'thread') renderThread(pg, full);
    else if (pg.type === 'profile') renderProfile(pg, full);
    else if (pg.type === 'chat') renderChat(pg, full);
  }
  function keepScroll(el, fn) {
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40, top = el.scrollTop;
    fn();
    el.scrollTop = atBottom && el.dataset.stick ? el.scrollHeight : top;
  }

  // thread
  function renderThread(pg, full) {
    const p = postIndex.get(pg.id);
    if (!p) { popPage(); return; }
    const a = author(p.by);
    if (full) {
      pg.el.innerHTML = `<div class="page-head"><button class="icon-btn" data-act="back" aria-label="Back">${I.back}</button><h2>Post</h2><span></span></div>
        <div class="page-body" data-role="body"></div><div class="replying" data-role="replying" hidden></div>
        <div class="composer-bar"><textarea id="thread-input" rows="1" maxlength="280" placeholder="Post your reply" aria-label="Reply"></textarea><button class="send-btn" data-act="send-reply">Reply</button></div>`;
      const ta = $('#thread-input', pg.el);
      ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSendReply(); } });
      ta.addEventListener('input', () => autoGrow(ta));
    }
    const t = now();
    const reps = p.replies.filter(r => r.t <= t).sort((x, y) => x.t - y.t);
    const next = S.queue.find(e => e.kind === 'reply' && e.post === p.id && e.t - t < 6000);
    const body = $('[data-role="body"]', pg.el);
    keepScroll(body, () => {
      body.innerHTML = `<div class="thread-main" data-pid="${p.id}">
          <div class="tm-author">${avatarHTML(p.by)}<div class="tm-names"><span class="name" data-act="profile" data-who="${p.by}">${esc(a.name)}${verHTML(a)}</span><span class="handle">@${esc(a.handle)}</span></div></div>
          ${p.text ? `<div class="post-text">${richText(p.text)}</div>` : ''}${mediaHTML(p)}${p.poll ? pollHTML(p) : ''}${p.quoteOf ? quoteCardHTML(p.quoteOf) : ''}
          <div class="stamp">${clockTime(p.t - (S.skew || 0) + (S.skew || 0))} · ${p.t < S.flight.start ? 'Before your flight' : 'On ' + esc(S.flight.no)}</div>
          <div class="stats"${W.kids ? ' hidden' : ''}><span><b data-k="rp" data-full="1">${fmtNum(repostsNow(p, t))}</b> Reposts</span><span><b data-k="l" data-full="1">${fmtNum(likesNow(p, t))}</b> Likes</span><span><b data-k="v" data-full="1">${fmtNum(viewsNow(p, t))}</b> Views</span></div>
          ${actionsHTML(p, t)}</div>` +
        reps.map(r => replyHTML(p, r, t)).join('') +
        (next ? `<div class="typing-row"><span class="typing"><i></i><i></i><i></i></span>${esc(author(next.by).name)} is replying</div>` : '') +
        (!reps.length && !next ? '<div class="empty">No replies yet. Be the first.</div>' : '');
    });
    const rp = $('[data-role="replying"]', pg.el);
    if (ui.replyTo && ui.replyTo.post === p.id && ui.replyTo.rid) {
      const r = p.replies.find(x => x.id === ui.replyTo.rid);
      rp.hidden = false;
      rp.innerHTML = `Replying to <b>@${esc(author(r.by).handle)}</b><button data-act="cancel-reply" aria-label="Cancel">${I.close}</button>`;
    } else rp.hidden = true;
  }
  function replyHTML(p, r, t) {
    const a = author(r.by), to = r.to && p.replies.find(x => x.id === r.to);
    const liked = !!S.liked[r.id];
    return `<div class="reply-row">${avatarHTML(r.by, 'sm')}<div class="post-body">
      <div class="post-head"><span class="name" data-act="profile" data-who="${r.by}">${esc(a.name)}</span>${verHTML(a)}<span class="handle">@${esc(a.handle)}</span><span class="time">· <span data-ts="${r.t}">${fmtAgo(t - r.t)}</span></span></div>
      ${to ? `<div class="reply-to">Replying to @${esc(author(to.by).handle)}</div>` : ''}
      <div class="post-text">${richText(r.text)}</div>
      <div class="r-actions"><button data-act="reply-to" data-post="${p.id}" data-rid="${r.id}">${I.reply}Reply</button>
        <button class="${liked ? 'on' : ''}" data-act="like-reply" data-post="${p.id}" data-rid="${r.id}" aria-label="Like reply">${W.kids ? I.star : I.heart}${W.kids ? '' : countText(r.likes + (liked ? 1 : 0))}</button>
        ${r.ratio ? '<span class="ratio-tag">RATIO</span>' : ''}${r.likedBy ? `<span class="liked-by">Liked by @${esc(author(r.likedBy).handle)}</span>` : ''}</div></div></div>`;
  }
  function doSendReply() {
    const pg = ui.stack[ui.stack.length - 1];
    if (!pg || pg.type !== 'thread') return;
    const ta = $('#thread-input', pg.el), text = ta.value.trim();
    if (!text) return;
    const warn = kidCheck(text);
    if (warn) { toast({ who: 'me', title: 'Hmm, try again', text: warn }); return; }
    const rid = ui.replyTo && ui.replyTo.post === pg.id ? ui.replyTo.rid : null;
    const tp = postIndex.get(pg.id), tgt = rid ? ((tp && tp.replies.find(x => x.id === rid)) || {}).by : tp && tp.by;
    if (tgt && tgt !== 'me' && isBlocked(tgt)) { toast({ who: tgt, title: '@' + C[tgt].handle + ' blocked you', text: 'You can\'t reply to them. Try an apology from their profile.' }); return; }
    sendReply(pg.id, text, rid);
    ta.value = ''; autoGrow(ta); ui.replyTo = null;
    const body = $('[data-role="body"]', pg.el);
    body.dataset.stick = '1';
    renderThread(pg, false);
    body.scrollTop = body.scrollHeight;
  }
  function autoGrow(ta) { ta.style.height = 'auto'; ta.style.height = Math.min(120, ta.scrollHeight + 2) + 'px'; }

  // profile
  function renderProfile(pg, full) {
    const id = pg.id, a = author(id), isMe = id === 'me', c = C[id], t = now();
    const followers = isMe ? followersNow(t) : id === 'overheard' ? ohFollowers(t) : c.followers + (S.following[id] ? 1 : 0);
    const r = AM.rng(AM.hash(id));
    const following = isMe ? Object.keys(S.following).length + 1 : id === 'overheard' ? 0 : Math.round(60 + r() * 900);
    const posts = S.posts.filter(p => p.by === id && p.t <= t).reverse();
    const body = full ? null : $('[data-role="body"]', pg.el);
    const html = `
      <div class="prof-banner" style="background-image:url(&quot;${AM.banner(a.hue, AM.hash(id + 'b'))}&quot;)"></div>
      <div class="prof-top">${avatarHTML(id, 'lg', false)}<div class="prof-actions">
        ${isMe ? `${S.landed ? '<button class="btn" data-act="show-wrapped">Flight recap</button>' : ''}<button class="btn" data-act="settings">Settings</button>`
          : `${isBlocked(id) ? (S.apologized[id] ? '<button class="btn" disabled>Apology sent</button>' : `<button class="btn" data-act="apologize" data-who="${id}">Apologize</button>`) : `<button class="btn" data-act="chat" data-who="${id}">Message</button>`}<button class="btn ${S.following[id] ? '' : 'dark'}" data-act="follow" data-who="${id}">${S.following[id] ? 'Following' : 'Follow'}</button>`}
      </div></div>
      <div class="prof-info"><h3>${esc(a.name)}${verHTML(a)}</h3><div class="handle">@${esc(a.handle)}${S.followedBy[id] && !W.kids ? ' <span class="follows-you">Follows you</span>' : ''}${relChip(id)}</div>
        <div class="bio">${isMe ? `Flying ${esc(S.player.from)} to ${esc(S.player.to)}. Feed packed, wifi not included.` : richText(c.bio)}</div>
        ${isMe ? `<div class="seat-tag">${I.planeUp} ${esc(S.flight.no)} · Seat ${esc(S.player.seat)}</div>` : ''}
        ${W.kids ? '' : `<div class="counts"><span><b>${fmtNum(following)}</b> Following</span><span><b>${fmtNum(followers)}</b> Followers</span><span><b>${posts.length}</b> Posts</span></div>`}</div>
      ${id === 'overheard' ? caseFileHTML(t) : ''}
      ${posts.length ? posts.map(p => postHTML(p)).join('') : `<div class="empty"><b>No posts yet</b>${isMe ? 'Tap the yellow button to post your first one.' : 'Check back later in the flight.'}</div>`}`;
    if (full) {
      pg.el.innerHTML = `<div class="page-head"><button class="icon-btn" data-act="back" aria-label="Back">${I.back}</button><h2>${esc(a.name)}<small>${posts.length} posts</small></h2><span></span></div>
        <div class="page-body" data-role="body">${html}</div>`;
    } else {
      keepScroll(body, () => { body.innerHTML = html; });
      $('.page-head h2', pg.el).innerHTML = `${esc(a.name)}<small>${posts.length} posts</small>`;
    }
  }
  function relChip(id) {
    if (W.kids || id === 'me') return '';
    if (isBlocked(id)) return ' <span class="rel-chip beef">Blocked you</span>';
    const r = relOf(id);
    return r <= -4 ? ' <span class="rel-chip beef">Beef with you</span>' : r >= 4 ? ' <span class="rel-chip bff">Your fan</span>' : '';
  }
  function caseFileHTML(t) {
    if (progress(t) < 0.08 && !S.revealT) return '';
    const cul = S.flight.culprit;
    if (S.revealT) {
      const c = ctx();
      const line = c.correct ? `You called it ${esc(c.calledAgo)} before the reveal.` : S.accuse ? `You guessed ${esc(C[S.accuse.id].name)}.` : 'You never made a call.';
      return `<div class="case-file"><h4>Unmasked</h4><p>It was <b>${esc(C[cul].name)}</b>. ${line}</p><div class="suspects">${SUSPECTS.map(id => suspectHTML(id, true, id === cul)).join('')}</div></div>`;
    }
    const call = S.accuse ? `<p class="case-call">Your call: <b>${esc(C[S.accuse.id].name)}</b>, made ${fmtAgo(t - S.accuse.t)} ago. You can change it until the unmasking.</p>` : '';
    return `<div class="case-file"><h4>${esc(ST.world.mysteryTitle)}</h4><p>${esc(ST.world.mysteryIntro)}</p>
      <div class="suspects">${SUSPECTS.map(id => suspectHTML(id, false, false)).join('')}</div>${call}</div>`;
  }
  function suspectHTML(id, locked, culprit) {
    const c = C[id], mine = S.accuse && S.accuse.id === id;
    return `<button class="suspect${culprit ? ' culprit' : ''}" data-act="accuse" data-who="${id}" aria-pressed="${!!mine}"${locked ? ' disabled' : ''}>${avatarHTML(id, 'sm', false)}<span><b>${esc(first(c.name))}${mine ? ' · your pick' : ''}</b><small>${esc(ROLE[id] || '')}${culprit ? ' · it was them' : ''}</small></span></button>`;
  }

  // chat
  function renderChat(pg, full) {
    const who = pg.id, a = author(who), d = dmOf(who), t = now();
    if (full) {
      pg.el.innerHTML = `<div class="page-head"><button class="icon-btn" data-act="back" aria-label="Back">${I.back}</button>
        <h2 data-act="profile" data-who="${who}" class="chat-title">${avatarHTML(who, 'xs', false)} ${esc(a.name)}<small data-role="status"></small></h2><span></span></div>
        <div class="page-body" data-role="body" data-stick="1"></div><div data-role="choices"></div>
        <div class="composer-bar" data-role="composer"><textarea id="chat-input" rows="1" maxlength="500" placeholder="Message ${esc(first(a.name))}" aria-label="Message"></textarea><button class="send-btn" data-act="send-dm">Send</button></div>`;
      const ta = $('#chat-input', pg.el);
      ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSendDm(); } });
      ta.addEventListener('input', () => autoGrow(ta));
    }
    d.unread = 0;
    const typing = S.queue.some(e => e.kind === 'dm' && e.who === who && e.t - t < 3200);
    let lastStamp = 0;
    const msgs = d.msgs.filter(m => m.t <= t).map(m => {
      let stamp = '';
      if (m.t - lastStamp > 5 * MIN) { stamp = `<div class="chat-stamp">${clockTime(m.t)}</div>`; }
      lastStamp = m.t;
      if (m.kind === 'shot') return stamp + `<div class="bubble them shot-bubble">${shotHTML()}</div>`;
      return stamp + `<div class="bubble ${m.from}">${richText(m.text)}</div>`;
    }).join('');
    const body = $('[data-role="body"]', pg.el);
    keepScroll(body, () => {
      body.innerHTML = `<div class="chat-body">${msgs || `<div class="empty"><b>Say hi to ${esc(first(a.name))}</b>Everyone here is AI. Be as weird as you like.</div>`}${typing ? '<span class="typing" aria-label="Typing"><i></i><i></i><i></i></span>' : ''}</div>`;
    });
    $('[data-role="status"]', pg.el).textContent = typing ? 'typing…' : '@' + a.handle;
    const opts = choiceOptions(d), ch = $('[data-role="choices"]', pg.el);
    const blocked = isBlocked(who);
    const sig = (opts ? JSON.stringify(d.choices) : '') + (blocked ? ':blocked:' + !!S.apologized[who] : '');
    if (ch.dataset.sig !== sig) {
      ch.dataset.sig = sig;
      ch.innerHTML = blocked ? `<div class="choices"><div class="choices-label">@${esc(a.handle)} blocked you</div><p class="blocked-note">You can't message them right now.</p>${S.apologized[who] ? '<p class="blocked-note">Apology sent. It\'s up to them now.</p>' : `<button class="choice" data-act="apologize" data-who="${who}">Send an apology</button>`}</div>` : opts ? `<div class="choices"><div class="choices-label">Your reply</div>${opts.map((o, i) => `<button class="choice" data-act="choice" data-who="${who}" data-i="${i}">${esc(o.label)}</button>`).join('')}</div>` : '';
      $('[data-role="composer"]', pg.el).hidden = !!opts || blocked;
    }
  }
  function doSendDm() {
    const pg = ui.stack[ui.stack.length - 1];
    if (!pg || pg.type !== 'chat') return;
    const ta = $('#chat-input', pg.el), text = ta.value.trim();
    if (!text) return;
    const warn = kidCheck(text);
    if (warn) { toast({ who: 'me', title: 'Hmm, try again', text: warn }); return; }
    ta.value = ''; autoGrow(ta);
    sendDm(pg.id, text);
    const body = $('[data-role="body"]', pg.el);
    body.scrollTop = body.scrollHeight;
  }

  // ---------- sheets ----------
  function openSheet(title, bodyHTML, foot, wide) {
    closeSheet();
    const wrap = document.createElement('div');
    wrap.id = 'sheet-wrap';
    wrap.innerHTML = `<div class="scrim" data-act="close-sheet"></div><div class="sheet${wide ? ' wide' : ''}" role="dialog" aria-label="${esc(title)}"><div class="sheet-grip"></div>
      <div class="sheet-head"><h3>${esc(title)}</h3><button class="icon-btn" data-act="close-sheet" aria-label="Close">${I.close}</button></div>
      <div class="sheet-body">${bodyHTML}</div>${foot || ''}</div>`;
    $('#overlay').appendChild(wrap);
    return wrap;
  }
  function closeSheet() { const w = $('#sheet-wrap'); if (w) w.remove(); ui.compose = null; }

  function openCompose(prefill) {
    const prompts = shuffle(R.prompts.length ? R.prompts : ['Rate your plane snack out of 10', 'Describe your seatmate in 3 words', 'Unpopular opinion:']).slice(0, 8);
    const w = openSheet('New post', `
      <div class="compose">${avatarHTML('me', '', false)}<div>
        <textarea id="compose-text" maxlength="280" placeholder="${W.kids ? `What's up, ${esc(first(S.player.name))}?` : 'What\'s happening at 37,000 feet?'}" aria-label="Post text"></textarea>
        <div id="compose-photo"></div><div class="compose-warn" id="compose-warn" hidden></div></div></div>
      <div class="prompt-row">${prompts.map(p => `<button class="chip soft" data-act="prompt" data-text="${esc(p)}">${esc(p)}</button>`).join('')}</div>`,
      `<div class="compose-foot"><div class="left">${W.kids ? '' : `<label class="icon-btn file-btn" aria-label="Add a photo">${I.image}<input type="file" id="compose-file" accept="image/*"></label>`}
        <button class="icon-btn${W.kids ? ' draw-big' : ''}" data-act="draw" aria-label="Draw something">${I.brush}${W.kids ? '<span>Draw</span>' : ''}</button><span class="count-ring" id="compose-count">280</span></div>
        <button class="btn primary" data-act="post-now" id="post-btn" disabled>Post</button></div>`);
    ui.compose = { photo: null, tag: null, drawing: false };
    const ta = $('#compose-text', w);
    if (prefill) ta.value = prefill;
    ta.addEventListener('input', composeChanged);
    if ($('#compose-file', w)) $('#compose-file', w).addEventListener('change', onPhoto);
    composeChanged();
    setTimeout(() => ta.focus(), 260);
  }
  function composeChanged() {
    const ta = $('#compose-text');
    if (!ta || !ui.compose) return;
    const left = 280 - ta.value.length, cnt = $('#compose-count');
    cnt.textContent = left; cnt.classList.toggle('warn', left < 20);
    $('#post-btn').disabled = !ta.value.trim() && !ui.compose.photo;
  }
  function renderComposePhoto() {
    const box = $('#compose-photo');
    if (!box || !ui.compose) return;
    if (!ui.compose.photo) { box.innerHTML = ''; return; }
    if (ui.compose.drawing) {
      box.innerHTML = `<div class="compose-prev drawing"><img src="${ui.compose.photo}" alt="Your drawing"><button data-act="remove-photo" aria-label="Remove drawing">${I.close}</button></div>`;
      return;
    }
    const tags = [['food', 'Food'], ['view', 'The view'], ['selfie', 'Selfie'], ['pet', 'Pet'], ['plane', 'The plane'], ['other', 'Something else']];
    box.innerHTML = `<div class="compose-prev"><img src="${ui.compose.photo}" alt="Your photo"><button data-act="remove-photo" aria-label="Remove photo">${I.close}</button></div>
      <div class="photo-tag"><div class="photo-tag-label">What's in it? (helps people react)</div><div class="chip-row">${tags.map(([k, l]) => `<button class="chip" data-act="photo-tag" data-v="${k}" aria-pressed="${ui.compose.tag === k}">${l}</button>`).join('')}</div></div>`;
  }
  function onPhoto(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 720, s = Math.min(1, max / Math.max(img.width, img.height));
        const cv = document.createElement('canvas');
        cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        let data;
        try { data = cv.toDataURL('image/jpeg', 0.72); } catch (err) { data = reader.result; }
        if (!ui.compose) return;
        ui.compose.photo = data; ui.compose.tag = ui.compose.tag || 'other';
        renderComposePhoto(); composeChanged();
      };
      img.onerror = () => toast({ who: 'me', title: 'That file didn\'t open', text: 'Try a JPG or PNG photo.' });
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function openSettings() {
    const f = S.flight, p = progress(now());
    openSheet('Settings', `
      <div class="setting-row"><span><b>Flight</b><small>${esc(f.no)} · ${esc(S.player.from)} to ${esc(S.player.to)} · ${esc(fmtFlight(f.minutes))}${f.minutes === 12 ? ' demo' : ''}</small></span><span class="count-ring">${Math.round(p * 100)}%</span></div>
      <div class="setting-row"><span><b>Sound</b><small>Cabin chimes for announcements and messages</small></span><button class="btn" data-act="sound">${S.sound ? 'On' : 'Off'}</button></div>
      <div class="setting-row"><span><b>Skip ahead</b><small>Demo tool: jump forward to see more of the story</small></span><span class="btn-row"><button class="btn" data-act="skip" data-f="0.05">+5%</button><button class="btn" data-act="skip" data-f="0.2">+20%</button><button class="btn" data-act="skip-land">Land</button></span></div>
      <div class="setting-row"><span><b>New flight</b><small>Ends this flight. The mystery gets a new culprit.</small></span><button class="btn" data-act="new-flight">${ui.confirmNew ? 'Tap again' : 'Start over'}</button></div>
      ${AM.KIDS ? (W.kids
        ? `<div class="setting-row"><span><b>Leave kids mode</b><small>Ends this flight and opens a grown-up boarding pass.</small></span><button class="btn" data-act="mode-switch" data-v="city">Leave</button></div>
           <div class="setting-row"><span><b>Parent PIN</b><small>Choose a new PIN for kids mode.</small></span><button class="btn" data-act="pin-change">Change</button></div>`
        : `<div class="setting-row"><span><b>Kids mode</b><small>Treetop Town: animal friends, jokes and learning. Locked with a parent PIN.</small></span><button class="btn" data-act="mode-switch" data-v="kids">Set up</button></div>`) : ''}
      <div class="setting-row ai-row" id="ai-row">${aiRowHTML()}</div>
      <div class="setting-row"><span><b>About</b><small>Airplane Mode ${APP_VERSION}. Every account here is make-believe, and nothing you post leaves this phone. The feed is packed before takeoff; with AI replies on, a model on this phone writes replies to what you say.</small></span></div>`);
  }
  function aiRowHTML() {
    const A = AM.AI, head = '<span><b>AI replies</b><small>';
    if (!A) return '';
    if (W.kids) return head + 'Off in kids mode. Kids always get the hand-written lines.</small></span>';
    if (A.inArtifact) return head + 'Works in the installed app at mrvk64.github.io/airplane-mode, not on this page.</small></span>';
    if (!A.supported()) return head + 'This browser can\'t run on-device AI, so replies use the built-in lines.</small></span>';
    const pct = Math.round((A.progress || 0) * 100);
    if (A.state === 'downloading' || A.state === 'loading') {
      return head + (A.state === 'downloading' ? 'Downloading the AI. Keep the app open.' : 'Waking up the AI.') +
        `</small><span class="ai-bar"><i style="width:${pct}%"></i></span><small>${pct}% · ${esc(trimText(A.detail || '', 60))}</small></span>`;
    }
    if (A.state === 'ready') {
      const l = A.stats.last, m = A.MODELS[A.tier] || A.MODELS.standard;
      return head + `On (${m.label}). Characters read what you write and answer it.${l ? ' Last reply took ' + (l.ms / 1000).toFixed(1) + ' s.' : ''}</small></span>` +
        `<button class="btn" data-act="ai-remove">${ui.confirmAi ? 'Tap again to delete' : 'Turn off'}</button>`;
    }
    const err = A.state === 'error' ? `<small class="ai-err">That didn't work: ${esc(A.detail)}. Try again on wifi.</small>` : '';
    const best = (navigator.deviceMemory || 4) >= 8;
    return head + 'Characters read what you write and answer it, with no internet. It downloads once, so use wifi.</small>' + err + '</span>' +
      `<span class="btn-row ai-pick"><button class="btn${best ? '' : ' dark'}" data-act="ai-start" data-v="standard">Standard · 670 MB</button>` +
      `<button class="btn${best ? ' dark' : ''}" data-act="ai-start" data-v="best">Best · 1.7 GB</button></span>`;
  }
  function renderAiRow() { const el = $('#ai-row'); if (el) el.innerHTML = aiRowHTML(); }
  // Drawing pad: kids post doodles instead of photos (grown-ups can doodle too).
  const DRAW_COLORS = ['#1F2430', '#E5484D', '#F28C28', '#F2C200', '#2EAE5A', '#2D6BE0', '#8E5BD6', '#FF7AB6', '#8B5A2B', '#FFFFFF'];
  function openDraw() {
    const el = document.createElement('div');
    el.className = 'drawpad'; el.id = 'drawpad';
    el.innerHTML = `<div class="dp-head"><button class="btn" data-act="draw-cancel">Cancel</button><b>Draw something</b><button class="btn primary" data-act="draw-done">Use it</button></div>
      <div class="dp-canvas-wrap"><canvas id="dp-canvas" width="720" height="720" aria-label="Drawing canvas"></canvas></div>
      <div class="dp-tools">
        <div class="dp-colors">${DRAW_COLORS.map((c, i) => `<button data-act="draw-color" data-v="${c}" style="--c:${c}" aria-pressed="${i === 0}" aria-label="Color ${c}"></button>`).join('')}</div>
        <div class="dp-row"><div class="dp-sizes">${[6, 14, 30].map((s, i) => `<button data-act="draw-size" data-v="${s}" aria-pressed="${i === 1}" aria-label="Brush size ${s}"><i style="width:${Math.round(s / 2 + 4)}px;height:${Math.round(s / 2 + 4)}px"></i></button>`).join('')}</div>
          <span class="btn-row"><button class="btn" data-act="draw-undo" aria-label="Undo">${I.undo}</button><button class="btn" data-act="draw-clear">Clear</button></span></div>
      </div>`;
    $('#overlay').appendChild(el);
    const cv = $('#dp-canvas'), g = cv.getContext('2d');
    ui.draw = { strokes: [], color: DRAW_COLORS[0], size: 14, cur: null, cv, g };
    const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; };
    cv.addEventListener('pointerdown', e => { e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (err) { /* capture is optional */ } const d = ui.draw; d.cur = { c: d.color, s: d.size * 2, p: [pos(e)] }; d.strokes.push(d.cur); redraw(); });
    cv.addEventListener('pointermove', e => { const d = ui.draw; if (!d || !d.cur) return; d.cur.p.push(pos(e)); drawStroke(d.cur, d.cur.p.length - 2); });
    const end = () => { if (ui.draw) ui.draw.cur = null; };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    redraw();
  }
  function drawStroke(st, from) {
    const g = ui.draw.g, p = st.p;
    g.strokeStyle = st.c; g.fillStyle = st.c; g.lineWidth = st.s; g.lineCap = 'round'; g.lineJoin = 'round';
    if (p.length === 1) { g.beginPath(); g.arc(p[0][0], p[0][1], st.s / 2, 0, Math.PI * 2); g.fill(); return; }
    g.beginPath(); g.moveTo(p[Math.max(0, from)][0], p[Math.max(0, from)][1]);
    for (let i = Math.max(1, from + 1); i < p.length; i++) g.lineTo(p[i][0], p[i][1]);
    g.stroke();
  }
  function redraw() {
    const d = ui.draw;
    d.g.fillStyle = '#FFFFFF'; d.g.fillRect(0, 0, d.cv.width, d.cv.height);
    d.strokes.forEach(st => drawStroke(st, 0));
  }
  function closeDraw(use) {
    const d = ui.draw, el = $('#drawpad');
    if (use && d && d.strokes.length && ui.compose) {
      ui.compose.photo = d.cv.toDataURL('image/jpeg', 0.85); ui.compose.tag = 'drawing'; ui.compose.drawing = true;
      renderComposePhoto(); composeChanged();
    }
    ui.draw = null;
    if (el) el.remove();
  }

  // ---------- PA, toasts and sound ----------
  function showPA(text, b) {
    const old = $('#overlay .pa');
    if (old) old.remove();
    const el = document.createElement('div');
    el.className = 'pa'; el.dataset.act = 'pa-close';
    el.innerHTML = `<span class="pa-icon">${I.speaker}</span><div><small>Cabin announcement</small><span>${esc(text)}</span></div>`;
    const strip = $('#strip').getBoundingClientRect(), app = $('#app').getBoundingClientRect();
    el.style.top = Math.round(strip.bottom - app.top + 8) + 'px';
    $('#overlay').appendChild(el);
    setTimeout(() => el.remove(), 8000);
    chime(!!b.chime);
    if (b.shake) { const v = $('#views'); v.classList.add('shake'); setTimeout(() => v.classList.remove('shake'), 1300); }
  }
  function toast(o) {
    const old = $('#overlay .toast');
    if (old) old.remove();
    clearTimeout(ui.toastTimer);
    const el = document.createElement('div');
    el.className = 'toast'; el.dataset.act = 'toast';
    ui.toastGo = o.go || null;
    el.innerHTML = `${avatarHTML(o.who, 'sm', false)}<div><b>${esc(o.title)}</b><span>${esc(o.text)}</span></div>`;
    $('#overlay').appendChild(el);
    ui.toastTimer = setTimeout(() => el.remove(), 4500);
  }
  function unlockAudio() {
    if (ui.audio) { if (ui.audio.state === 'suspended') ui.audio.resume().catch(() => {}); return; }
    try { const AC = window.AudioContext || window.webkitAudioContext; if (AC) ui.audio = new AC(); } catch (e) { ui.audio = null; }
  }
  function tone(freq, at, dur, vol) {
    const ac = ui.audio, o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(vol, at + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g); g.connect(ac.destination);
    o.start(at); o.stop(at + dur + 0.05);
  }
  function chime(two) {
    if (!S || !S.sound || !ui.audio) return;
    try { const t0 = ui.audio.currentTime + 0.03; tone(1318.5, t0, 1.1, 0.16); if (two) tone(1046.5, t0 + 0.55, 1.4, 0.14); } catch (e) { /* no sound */ }
  }
  function blip() {
    if (!S || !S.sound || !ui.audio) return;
    try { const t0 = ui.audio.currentTime + 0.02; tone(880, t0, 0.18, 0.05); tone(1320, t0 + 0.08, 0.2, 0.04); } catch (e) { /* no sound */ }
  }

  // ---------- boarding ----------
  const boardInterests = () => (ui.board && ui.board.kids && AM.KIDS ? AM.KIDS.STORY.world.interests : AM.STORY.world.interests);
  function randomSeat() { return (8 + Math.floor(Math.random() * 30)) + 'ABCDEF'.charAt(Math.floor(Math.random() * 6)); }
  const KID_EMOJIS = ['🐶', '🐱', '🦊', '🐼', '🐨', '🐯', '🦁', '🐸', '🐵', '🦄', '🐧', '🐢'];

  // ---------- parent PIN ----------
  // A parental gate, not a vault: the PIN is stored hashed on this device and asked for before
  // settings, leaving kids mode, or starting kids mode from a grown-up flight.
  const PIN_KEY = 'airplane-mode/parent';
  function pinHash() { try { return localStorage.getItem(PIN_KEY) || ui.pinMem || ''; } catch (e) { return ui.pinMem || ''; } }
  function setPin(pin) { const h = String(AM.hash('pin:' + pin)); ui.pinMem = h; try { localStorage.setItem(PIN_KEY, h); } catch (e) { /* kept in memory */ } }
  function pinSheet(mode, done) {
    ui.pin = { mode, done, entry: '', first: null };
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'];
    const w = openSheet(mode === 'set' ? 'Set a parent PIN' : 'Grown-ups only', `
      <p id="pin-msg">${mode === 'set' ? 'Grown-ups: choose a 4-digit PIN. You\'ll need it to change settings or leave kids mode.' : 'Enter the parent PIN to continue.'}</p>
      <div class="pin-dots" id="pin-dots" aria-live="polite"></div>
      <div class="pin-pad">${keys.map(k => `<button type="button" data-act="pin-key" data-k="${k}" aria-label="${k === 'back' ? 'Delete' : k === 'clear' ? 'Clear' : k}">${k === 'back' ? I.undo : k === 'clear' ? 'Clear' : k}</button>`).join('')}</div>`);
    w.classList.add('pin-wrap');
    renderPinDots();
  }
  function renderPinDots() {
    const el = $('#pin-dots');
    if (el && ui.pin) el.innerHTML = [0, 1, 2, 3].map(i => `<i class="${i < ui.pin.entry.length ? 'on' : ''}"></i>`).join('');
  }
  function pinKey(k) {
    const p = ui.pin;
    if (!p) return;
    if (k === 'back') p.entry = p.entry.slice(0, -1);
    else if (k === 'clear') p.entry = '';
    else if (p.entry.length < 4) p.entry += k;
    renderPinDots();
    if (p.entry.length < 4) return;
    const msg = $('#pin-msg'), entry = p.entry;
    p.entry = '';
    if (p.mode === 'set') {
      if (!p.first) { p.first = entry; msg.textContent = 'Type the same PIN again to confirm.'; setTimeout(renderPinDots, 150); return; }
      if (p.first !== entry) { p.first = null; msg.textContent = 'Those didn\'t match. Choose a PIN again.'; shakePin(); return; }
      setPin(entry);
    } else if (String(AM.hash('pin:' + entry)) !== pinHash()) { msg.textContent = 'That\'s not the PIN. Try again.'; shakePin(); return; }
    const done = p.done;
    ui.pin = null; closeSheet();
    if (done) done();
  }
  function shakePin() { const d = $('#pin-dots'); if (!d) return; d.classList.remove('shake'); void d.offsetWidth; d.classList.add('shake'); setTimeout(renderPinDots, 200); }

  // ---------- kids safety ----------
  const KID_BLOCK = /\b(fuck\w*|shit\w*|bitch\w*|ass(hole)?s?|bastard|damn\w*|crap|piss\w*|dick\w*|cock\w*|pussy|slut|whore|sex\w*|porn\w*|kill (yourself|urself)|kys|stupid|idiot|dumb|shut up|hate you|loser|ugly|you suck|go away|nobody likes you)\b/i;
  const KID_PRIVATE = /(\d[\s.-]?){7,}|@\w+\.\w+|\b\d{1,5}\s+\w+\s+(street|st|road|rd|avenue|ave|lane|ln|drive|dr|court|ct)\b|\b(my address|i live (at|on)|my school is|my password)\b/i;
  function kidCheck(text) {
    if (!W.kids) return null;
    if (KID_PRIVATE.test(text)) return 'Let\'s keep phone numbers, addresses and school names secret, even here.';
    if (KID_BLOCK.test(text)) return 'Treetop Town only uses kind words. Try saying it another way!';
    return null;
  }
  function showBoarding(prev) {
    const kids = !!(prev && prev.world === 'kids' && AM.KIDS);
    ui.board = {
      kids, locked: kids && !!pinHash(), prev,
      emoji: prev ? prev.emoji : kids ? '🐶' : '😎', hue: prev ? prev.hue : 210, dur: 12, tier: prev ? prev.tier : 'nobody',
      interests: prev ? prev.interests.slice() : ['food', 'memes', 'travel'], seat: randomSeat(), carry: prev ? prev.carry : null, handleEdited: !!prev
    };
    const el = document.createElement('div');
    el.className = 'boarding'; el.id = 'boarding';
    $('#overlay').appendChild(el);
    renderBoarding();
  }
  // Switching between grown-up and kids redraws the pass but keeps what was typed.
  function setBoardMode(kids) {
    const b = ui.board, el = $('#boarding');
    if (!b || !el || b.kids === kids) return;
    const keep = { name: $('#b-name', el).value, from: $('#b-from', el).value, to: $('#b-to', el).value };
    b.kids = kids;
    b.emoji = kids ? KID_EMOJIS[0] : EMOJIS[0];
    b.interests = boardInterests().slice(0, 3);
    renderBoarding(keep);
  }
  function renderBoarding(keep) {
    const b = ui.board, prev = b.prev, el = $('#boarding'), kids = b.kids;
    const val = (k, fallback) => esc(keep && keep[k] != null ? keep[k] : fallback);
    const tierBtns = Object.keys(TIERS).map(k => {
      const tr = TIERS[k], f = prev && prev.tier === k && prev.carry != null ? prev.carry : tr.followers;
      return `<button data-act="b-pick" data-group="tier" data-v="${k}" aria-pressed="${b.tier === k}"><b>${tr.label}</b><small>${fmtNum(f)} followers</small></button>`;
    }).join('');
    const hasKids = !!AM.KIDS;
    el.innerHTML = `
      <div class="boarding-hello"><div class="wordmark"><span class="glyph">${I.planeUp}</span>Airplane Mode</div>
        <h1>${kids ? 'Ready for takeoff, explorer?' : prev ? 'Ready for the next flight?' : 'Social media for when there\'s no wifi'}</h1>
        <p>${kids ? 'Treetop Town is full of animal friends, jokes, things to learn and a mystery to solve. It all runs on this phone.'
          : prev ? 'New flight, new mystery, same you. Your followers come with you.' : 'A whole city of AI people, a mystery to solve and a feed timed to your flight. It all runs on this phone.'}</p>
        ${hasKids ? `<div class="mode-switch" role="group" aria-label="Who is flying"><button type="button" data-act="b-mode" data-v="city" aria-pressed="${!kids}">Grown-up</button>
          <button type="button" data-act="b-mode" data-v="kids" aria-pressed="${kids}">${b.locked ? I.lock.replace('<svg', '<svg width="14" height="14"') : ''}Kids</button></div>` : ''}</div>
      <form class="pass${kids ? ' junior' : ''}" id="pass" autocomplete="off">
        <div class="pass-top"><span>${kids ? 'Junior boarding pass' : 'Boarding pass'}</span><span>Group 1</span></div>
        <div class="pass-route">
          <div class="from"><label for="b-from">From</label><input id="b-from" maxlength="4" placeholder="JFK" value="${val('from', prev ? prev.to : '')}"></div>
          <div class="plane">${I.planeRight.replace('<svg', '<svg width="28" height="28"')}</div>
          <div class="to"><label for="b-to">To</label><input id="b-to" maxlength="4" placeholder="LAX" value="${val('to', prev ? prev.from : '')}"></div>
        </div>
        <div class="pass-grid">
          <div class="field${kids ? ' full' : ''}"><label for="b-name">${kids ? 'First name' : 'Passenger'}</label><input type="text" id="b-name" maxlength="${kids ? 14 : 24}" placeholder="${kids ? 'Just your first name' : 'Your name'}" value="${val('name', prev ? prev.name : '')}"></div>
          ${kids ? '' : `<div class="field"><label for="b-handle">Handle</label><input type="text" id="b-handle" maxlength="18" placeholder="yourname" value="${esc(prev ? prev.handle : '')}"></div>`}
          <div class="field full"><span class="field-label">Avatar</span>
            <div class="emoji-pick">${(kids ? KID_EMOJIS : EMOJIS).map(e => `<button type="button" data-act="b-pick" data-group="emoji" data-v="${e}" aria-pressed="${b.emoji === e}" aria-label="Avatar ${e}">${e}</button>`).join('')}</div>
            <div class="hue-pick">${HUES.map(h => `<button type="button" data-act="b-pick" data-group="hue" data-v="${h}" style="--h:${h}" aria-pressed="${b.hue === h}" aria-label="Color"></button>`).join('')}</div></div>
          <div class="field full"><span class="field-label">Flight time</span><div class="chip-row">${DURATIONS.map(([m, l, sub]) => `<button type="button" class="chip" data-act="b-pick" data-group="dur" data-v="${m}" aria-pressed="${b.dur === m}">${l}${sub ? ' · ' + sub : ''}</button>`).join('')}</div></div>
          ${kids ? '' : `<div class="field full"><span class="field-label">Board as</span><div class="tier-pick">${tierBtns.replace(/<button /g, '<button type="button" ')}</div></div>`}
          <div class="field full"><span class="field-label">${kids ? 'I like' : 'Your feed leans toward'}</span><div class="chip-row">${boardInterests().map(k => `<button type="button" class="chip" data-act="b-int" data-v="${k}" aria-pressed="${b.interests.includes(k)}">${k.charAt(0).toUpperCase() + k.slice(1)}</button>`).join('')}</div></div>
        </div>
        <div class="perf" aria-hidden="true"></div>
        <div class="pass-stub">
          <div class="stub-row"><div><span class="field-label">Seat</span><b>${b.seat}</b></div><div><span class="field-label">Wifi</span><b>None</b></div><div><span class="field-label">${kids ? 'Fun' : 'Feed'}</span><b>${kids ? 'Max' : 'Packed'}</b></div></div>
          <div class="barcode" aria-hidden="true"></div>
          <button type="submit" class="board-btn">Board ${I.planeRight.replace('<svg', '<svg width="22" height="22"')}</button>
          <div class="board-note">${kids ? 'For grown-ups: kids mode is locked with a PIN you choose. No photos, no strangers, no like counts. Everyone in it is a make-believe character.'
            : 'Everyone in this app is AI and fictional. What you post stays on this phone.'}</div>
        </div>
      </form>`;
    el.scrollTop = 0;
    const name = $('#b-name', el), handle = $('#b-handle', el);
    if (handle) {
      name.addEventListener('input', () => { if (!b.handleEdited) handle.value = toHandle(name.value); });
      handle.addEventListener('input', () => { b.handleEdited = true; handle.value = handle.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''); });
    }
    ['#b-from', '#b-to'].forEach(s => $(s, el).addEventListener('input', e => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, ''); }));
    $('#pass', el).addEventListener('submit', e => { e.preventDefault(); board(); });
  }
  const toHandle = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 15);
  function board() {
    const el = $('#boarding'), b = ui.board;
    if (!el || !b) return;
    unlockAudio();
    // Kids mode needs a grown-up's PIN first; it locks settings and leaving kids mode.
    if (b.kids && !pinHash()) { pinSheet('set', () => { b.pinOk = true; board(); }); return; }
    if (b.kids && b.kids !== !!(b.prev && b.prev.world === 'kids') && !b.pinOk) { pinSheet('check', () => { b.pinOk = true; board(); }); return; }
    const seat = b.seat;
    const name = $('#b-name', el).value.trim().replace(/\s+/g, ' ') || (b.kids ? 'Explorer' : 'Passenger ' + seat);
    const hEl = $('#b-handle', el);
    let handle = (hEl && hEl.value || toHandle(name) + (b.kids ? seat.toLowerCase() : '')).replace(/[^a-z0-9_.]/g, '').replace(/^\.+|\.+$/g, '').slice(0, 18);
    const world = b.kids ? AM.KIDS.CAST : AM.CAST;
    if (!handle || world.some(c => c.handle === handle)) handle = (handle || 'seat') + seat.toLowerCase();
    const from = $('#b-from', el).value.trim() || 'HOME', to = $('#b-to', el).value.trim() || 'AWAY';
    const carry = !b.kids && b.carry != null && !(b.prev && b.prev.world === 'kids') ? b.carry : null;
    newWorld({ world: b.kids ? 'kids' : 'city', name, handle, emoji: b.emoji, hue: b.hue, from, to, seat, tier: b.kids ? 'nobody' : b.tier,
      interests: b.interests.length ? b.interests : boardInterests().slice(0, 2), dur: b.dur, carry });
    ui.board = null; ui.tab = 'home'; ui.stack.forEach(pg => pg.el && pg.el.remove()); ui.stack = []; ui.prevRevealed = 0; ui.homeKey = '';
    $$('#overlay .wrapped').forEach(w => w.remove());
    renderAll();
    startTicking();
    tick();
    if (AM.AI && !W.kids) AM.AI.resume();
    el.classList.add('away');
    setTimeout(() => el.remove(), 480);
  }

  // ---------- landing recap ----------
  function wrappedData() {
    const t = now(), F = followersNow(t), c = ctx(), cul = C[S.flight.culprit];
    let top = null;
    S.mine.forEach(id => { const p = postIndex.get(id); if (p && (!top || likesNow(p, t) > likesNow(top, t))) top = p; });
    const likes = S.mine.reduce((a, id) => { const p = postIndex.get(id); return a + (p ? likesNow(p, t) - (S.liked[p.id] ? 1 : 0) : 0); }, 0);
    const mystery = c.correct ? `It was ${cul.name}. You called it ${c.calledAgo} before the reveal.`
      : S.accuse ? `It was ${cul.name}. You guessed ${C[S.accuse.id].name}.` : `It was ${cul.name}. You never made a call.`;
    const f = S.flags, chips = (ST.recapChips ? ST.recapChips(f, S.dmSent || {}, S.flight.winner) : []).slice();
    if (f.gamePick) chips.splice(chips.length ? chips.length - 1 : 0, 0, f.gamePick === S.flight.winner ? (W.kids ? 'Called the race' : 'Called the game') : (W.kids ? 'Cheered for ' + ST.game.names[f.gamePick] : 'Backed the wrong team'));
    const rels = Object.keys(S.rel || {}).filter(id => C[id]).sort((a, b) => relOf(a) - relOf(b));
    const rival = rels.length && relOf(rels[0]) <= -4 ? rels[0] : null, fan = rels.length && relOf(rels[rels.length - 1]) >= 4 ? rels[rels.length - 1] : null;
    const learned = Object.keys(S.learned || {}).length, quizzes = Object.values(S.quiz || {});
    return { F, gain: F - S.player.startFollowers, likes, top, mystery, ending: ST.endings[c.vk.ending], chips, posts: S.stats.posts, replies: S.stats.repliesGot,
      rival, fan, learned, quizRight: quizzes.filter(Boolean).length, quizTotal: quizzes.length };
  }
  function showWrapped() {
    if (!S || $('#overlay .wrapped')) return;
    const w = wrappedData(), t = now();
    const el = document.createElement('div');
    el.className = 'wrapped';
    el.innerHTML = `<div class="wrapped-card">
      <div class="wrapped-head"><div class="kicker">Flight recap · ${esc(S.flight.no)}</div><h2>You've landed</h2>
        <div class="route">${esc(S.player.from)} → ${esc(S.player.to)} · ${esc(fmtFlight(S.flight.minutes))} · Seat ${esc(S.player.seat)}</div></div>
      <div class="w-stats">${W.kids
        ? `<div><b>${fmtNum(w.likes)}</b><small>Stars collected</small></div><div><b>${w.posts}</b><small>Posts</small></div>
           <div><b>${w.learned}</b><small>Things learned</small></div>${w.quizTotal ? `<div><b>${w.quizRight}/${w.quizTotal}</b><small>Quiz answers right</small></div>` : `<div><b>${w.replies}</b><small>Friends who replied</small></div>`}`
        : `<div><b>${w.gain >= 0 ? '+' : ''}${fmtNum(w.gain)}</b><small>Followers gained</small></div>
           <div><b>${fmtNum(w.likes)}</b><small>Likes received</small></div>
           <div><b>${w.posts}</b><small>Posts</small></div>
           <div><b>${w.learned}</b><small>Things learned</small></div>`}</div>
      <div class="w-sec"><span class="field-label">Your top post</span>${w.top ? `<div class="w-top">${esc(trimText(w.top.text || (w.top.photo ? (w.top.drawing ? 'A drawing' : 'A photo') : 'A screenshot'), 140))}<small>${W.kids ? repliesNow(w.top, t) + ' friends replied' : fmtNum(likesNow(w.top, t)) + ' likes · ' + repliesNow(w.top, t) + ' replies'}</small></div>` : `<p>You didn't post this flight. Next time, say hi. ${W.kids ? 'Everyone here would love to meet you!' : 'People here are nice. Mostly.'}</p>`}</div>
      ${w.rival || w.fan ? `<div class="w-sec"><span class="field-label">Your people</span><p>${w.fan ? `Biggest fan: <b>${esc(C[w.fan].name)}</b>. ` : ''}${w.rival ? `Archnemesis: <b>${esc(C[w.rival].name)}</b>.` : ''}</p></div>` : ''}
      <div class="w-sec"><span class="field-label">${esc(ST.world.mysteryTitle)}</span><p>${esc(w.mystery)}</p></div>
      <div class="w-sec"><span class="field-label">${esc(ST.endingLabel)}</span><h4>${esc(w.ending.title)}</h4><p>${esc(w.ending.blurb)}</p></div>
      <div class="w-sec"><span class="field-label">Your choices</span><div class="w-choices">${w.chips.map(x => `<span>${esc(x)}</span>`).join('')}</div></div>
      <div class="w-actions"><button class="btn ink" data-act="fly-again">Fly again</button><button class="btn ghost" data-act="copy-recap">Copy recap</button><button class="btn ghost" data-act="close-wrapped">Back to the feed</button>
        <div class="board-note" id="copy-note" hidden></div></div></div>`;
    $('#overlay').appendChild(el);
  }
  function recapText() {
    const w = wrappedData();
    return `Airplane Mode · ${S.flight.no} ${S.player.from} to ${S.player.to} (${fmtFlight(S.flight.minutes)})\n` +
      (W.kids ? `${fmtNum(w.likes)} stars · ${w.posts} posts · ${w.learned} things learned\n` : `${w.gain >= 0 ? '+' : ''}${fmtNum(w.gain)} followers · ${fmtNum(w.likes)} likes · ${w.posts} posts\n`) +
      `${w.mystery}\nEnding: ${w.ending.title}`;
  }

  // ---------- input ----------
  function go(g) {
    if (!g) return;
    if (g.chat) openChat(g.chat);
    else if (g.post) { if (postIndex.get(g.post)) pushPage({ type: 'thread', id: g.post }); }
    else if (g.profile) pushPage({ type: 'profile', id: g.profile });
    else if (g.tab) { closeAllPages(); setTab(g.tab); }
    else if (g.settings) { if (W.kids) pinSheet('check', openSettings); else openSettings(); }
  }
  function openChat(who) { if (!chatOpen(who)) pushPage({ type: 'chat', id: who }); }
  function closeAllPages() { while (ui.stack.length) popPage(); }
  function pressSiblings(el) { Array.from(el.parentElement.children).forEach(b => b.setAttribute('aria-pressed', String(b === el))); }
  function pressGroup(el) {
    $$('[data-group="' + el.dataset.group + '"]', el.closest('.field') || el.parentElement).forEach(b => b.setAttribute('aria-pressed', 'false'));
    el.setAttribute('aria-pressed', 'true');
  }

  function onClick(ev) {
    const el = ev.target.closest('[data-act]');
    if (!el) return;
    const a = el.dataset.act, d = el.dataset;
    if (!S && !['b-pick', 'b-int', 'b-mode', 'pin-key', 'close-sheet'].includes(a)) return;
    switch (a) {
      case 'tab': closeAllPages(); if (d.tab === ui.tab && d.tab === 'home') { $('#v-home').scrollTo({ top: 0, behavior: 'smooth' }); } setTab(d.tab); break;
      case 'open-post': if (!window.getSelection || !String(window.getSelection())) pushPage({ type: 'thread', id: d.id }); break;
      case 'reply': pushPage({ type: 'thread', id: d.id }); setTimeout(() => { const ta = $('#thread-input'); if (ta) ta.focus(); }, 250); break;
      case 'like': {
        S.liked[d.id] = !S.liked[d.id];
        const lp = postIndex.get(d.id);
        if (lp && lp.by !== 'me') bump(lp.by, S.liked[d.id] ? 0.5 : -0.5);
        el.classList.toggle('on', !!S.liked[d.id]); if (W.kids && el.querySelector('span')) el.querySelector('span').textContent = S.liked[d.id] ? 'Starred' : 'Star'; el.classList.remove('pop'); void el.offsetWidth; if (S.liked[d.id]) el.classList.add('pop');
        updateCounts(now()); saveSoon(); break;
      }
      case 'repost': S.reposted[d.id] = !S.reposted[d.id]; el.classList.toggle('on', !!S.reposted[d.id]); updateCounts(now()); saveSoon(); break;
      case 'profile': if (d.who) { const top = ui.stack[ui.stack.length - 1]; if (!(top && top.type === 'profile' && top.id === d.who)) pushPage({ type: 'profile', id: d.who }); } break;
      case 'back': popPage(); break;
      case 'compose': openCompose(); break;
      case 'prompt': { const ta = $('#compose-text'); if (ta) { ta.value = ta.value.trim() ? ta.value.trimEnd() + ' ' + d.text + ' ' : d.text + ' '; ta.focus(); composeChanged(); } break; }
      case 'photo-tag': if (ui.compose) { ui.compose.tag = d.v; renderComposePhoto(); } break;
      case 'remove-photo': if (ui.compose) { ui.compose.photo = null; ui.compose.tag = null; ui.compose.drawing = false; const f = $('#compose-file'); if (f) f.value = ''; renderComposePhoto(); composeChanged(); } break;
      case 'draw': openDraw(); break;
      case 'draw-cancel': closeDraw(false); break;
      case 'draw-done': closeDraw(true); break;
      case 'draw-color': if (ui.draw) { ui.draw.color = d.v; pressSiblings(el); } break;
      case 'draw-size': if (ui.draw) { ui.draw.size = +d.v; pressSiblings(el); } break;
      case 'draw-undo': if (ui.draw) { ui.draw.strokes.pop(); redraw(); } break;
      case 'draw-clear': if (ui.draw) { ui.draw.strokes = []; redraw(); } break;
      case 'pin-key': pinKey(d.k); break;
      case 'pin-change': closeSheet(); pinSheet('set', () => toast({ who: 'me', title: 'PIN changed', text: 'Use the new PIN next time.' })); break;
      case 'mode-switch': {
        const toKids = d.v === 'kids', goSwitch = () => { closeSheet(); const prev = { name: S.player.name, emoji: toKids ? KID_EMOJIS[0] : EMOJIS[0], hue: S.player.hue, from: S.player.from, to: S.player.to,
          tier: 'nobody', interests: [], world: toKids ? 'kids' : 'city' }; $$('#overlay .wrapped').forEach(w => w.remove()); closeAllPages(); showBoarding(prev);
          if (ui.board) { ui.board.prev = null; ui.board.interests = boardInterests().slice(0, 3); ui.board.locked = false; renderBoarding({ name: first(S.player.name) }); } };
        goSwitch(); // in kids mode, Settings itself is behind the parent PIN
        break;
      }
      case 'b-mode': {
        const b = ui.board; if (!b) break;
        const toKids = d.v === 'kids';
        if (!toKids && b.kids && b.locked) pinSheet('check', () => { b.locked = false; setBoardMode(false); });
        else setBoardMode(toKids);
        break;
      }
      case 'post-now': {
        const ta = $('#compose-text');
        if (!ta || !ui.compose) break;
        const text = ta.value.trim();
        if (!text && !ui.compose.photo) break;
        const warn = kidCheck(text), wb = $('#compose-warn');
        if (warn) { if (wb) { wb.hidden = false; wb.textContent = warn; } break; }
        playerPost({ text, photo: ui.compose.photo, drawing: !!ui.compose.drawing, tag: ui.compose.photo ? ui.compose.tag : null });
        closeSheet(); closeAllPages(); setTab('home'); ui.prevRevealed = S.revealedUntil - 1; renderHome(true); $('#v-home').scrollTop = 0;
        break;
      }
      case 'close-sheet': closeSheet(); ui.confirmNew = false; break;
      case 'algo': {
        S.algo = d.v; renderAlgo();
        if (d.v !== 'balanced') { const t = now(); S.slots.splice(S.slotIdx, 0, t + 2500, t + 6000); }
        toast({ who: 'me', title: 'Algorithm tuned', text: d.v === 'balanced' ? 'Back to a bit of everything.' : `More ${d.v} coming up.` });
        saveSoon(); break;
      }
      case 'reveal': reveal(); break;
      case 'poll': {
        const p = postIndex.get(d.id), i = +d.i;
        if (!p) break;
        S.polls[p.id] = i;
        if (p.pollId === 'game') S.flags.gamePick = ST.game.teams[i];
        if (p.pollId === 'accuse' && !S.revealT) accuse(SUSPECTS[i]);
        rerenderPost(p); saveSoon(); break;
      }
      case 'follow': S.following[d.who] = !S.following[d.who]; bump(d.who, S.following[d.who] ? 1.5 : -1.5); refreshOpen(); saveSoon(); break;
      case 'chat': openChat(d.who); break;
      case 'ai-start': if (AM.AI) { AM.AI.start(d.v).catch(() => {}); renderAiRow(); } break;
      case 'ai-remove':
        if (!ui.confirmAi) { ui.confirmAi = true; renderAiRow(); break; }
        ui.confirmAi = false; AM.AI.remove().then(renderAiRow); break;
      case 'reload-app': save(); location.reload(); break;
      case 'apologize':
        if (!isBlocked(d.who) || S.apologized[d.who]) break;
        S.apologized[d.who] = true;
        schedule({ t: now() + rand(8000, 20000), kind: 'apology', who: d.who });
        toast({ who: 'me', title: 'Apology sent', text: first(C[d.who].name) + ' will see it. No promises.' });
        refreshOpen(); saveSoon(); break;
      case 'learn-cat': ui.learnCat = d.v; renderLearn(); break;
      case 'learn-more': S.learned[d.id] = 'more'; rerenderCard(d.id); saveSoon(); break;
      case 'bust': S.learned[d.id] = 'busted'; rerenderCard(d.id); saveSoon(); break;
      case 'quiz': {
        const c = (AM.LEARN || []).find(x => x.id === d.id);
        if (!c || S.quiz[c.id] !== undefined) break;
        S.quiz[c.id] = +d.i === c.answer;
        S.quizPick = S.quizPick || {}; S.quizPick[c.id] = +d.i;
        S.learned[c.id] = 'quiz';
        if (S.quiz[c.id]) blip();
        rerenderCard(c.id); saveSoon(); break;
      }
      case 'accuse': if (!S.revealT) { accuse(d.who); refreshOpen(); } break;
      case 'choice': choose(d.who, +d.i); break;
      case 'send-dm': doSendDm(); break;
      case 'send-reply': doSendReply(); break;
      case 'reply-to': {
        const top = ui.stack[ui.stack.length - 1];
        ui.replyTo = { post: d.post, rid: d.rid };
        if (top) renderThread(top, false);
        const ta = $('#thread-input'); if (ta) ta.focus();
        break;
      }
      case 'cancel-reply': { ui.replyTo = null; const top = ui.stack[ui.stack.length - 1]; if (top) renderThread(top, false); break; }
      case 'like-reply': {
        S.liked[d.rid] = !S.liked[d.rid];
        const top = ui.stack[ui.stack.length - 1]; if (top && top.type === 'thread') renderThread(top, false);
        saveSoon(); break;
      }
      case 'search': {
        const q = d.q || '';
        ui.query = (ST.trendQ || {})[q] || q.toLowerCase();
        closeSheet(); closeAllPages(); setTab('explore');
        $('#q').value = ui.query; renderExplore(); $('#v-explore').scrollTop = 0;
        break;
      }
      case 'notif': { const n = S.notifs.find(x => x.id === d.id); if (n) go(n.go); break; }
      case 'strip': ui.stripOpen = !ui.stripOpen; $('#s-more').hidden = !ui.stripOpen; updateStrip(now()); break;
      case 'settings': if (W.kids) pinSheet('check', openSettings); else openSettings(); break;
      case 'sound': S.sound = !S.sound; unlockAudio(); el.textContent = S.sound ? 'On' : 'Off'; if (S.sound) chime(false); saveSoon(); break;
      case 'skip': S.skew = (S.skew || 0) + S.flight.duration * +d.f; closeSheet(); tick(); break;
      case 'skip-land': S.skew = (S.skew || 0) + Math.max(0, S.flight.start + S.flight.duration + 500 - now()); closeSheet(); tick(); break;
      case 'new-flight':
        if (!ui.confirmNew) { ui.confirmNew = true; el.textContent = 'Tap again'; break; }
        ui.confirmNew = false; closeSheet(); flyAgain(); break;
      case 'pa-close': el.remove(); break;
      case 'toast': el.remove(); go(ui.toastGo); break;
      case 'show-wrapped': showWrapped(); break;
      case 'close-wrapped': { const w = $('#overlay .wrapped'); if (w) w.remove(); break; }
      case 'fly-again': flyAgain(); break;
      case 'copy-recap': {
        const text = recapText(), note = $('#copy-note');
        const done = ok => { if (note) { note.hidden = false; note.textContent = ok ? 'Copied. Paste it anywhere once you\'re back online.' : text; } };
        try { navigator.clipboard.writeText(text).then(() => done(true), () => done(false)); } catch (e) { done(false); }
        break;
      }
      case 'b-pick': {
        const b = ui.board; if (!b) break;
        const g = d.group, v = d.v;
        if (g === 'emoji') b.emoji = v; else if (g === 'hue') b.hue = +v; else if (g === 'dur') b.dur = +v; else if (g === 'tier') b.tier = v;
        pressGroup(el); break;
      }
      case 'b-int': {
        const b = ui.board; if (!b) break;
        const i = b.interests.indexOf(d.v);
        if (i >= 0) b.interests.splice(i, 1); else b.interests.push(d.v);
        el.setAttribute('aria-pressed', String(i < 0)); break;
      }
    }
  }
  function accuse(id) {
    S.accuse = { id, t: now() };
    S.flags.accused = true;
    const ap = S.posts.find(p => p.pollId === 'accuse');
    if (ap) { S.polls[ap.id] = SUSPECTS.indexOf(id); rerenderPost(ap); }
    toast({ who: id, title: `Your call: ${C[id].name}`, text: 'You can change it until the unmasking.', go: { profile: 'overheard' } });
    saveSoon();
  }
  function rerenderPost(p) {
    if (!p) return;
    $$(`article.post[data-id="${p.id}"]`).forEach(el => { const tmp = document.createElement('div'); tmp.innerHTML = postHTML(p).trim(); el.replaceWith(tmp.firstChild); });
    const top = ui.stack[ui.stack.length - 1];
    if (top && top.type === 'thread' && top.id === p.id) renderThread(top, false);
  }
  function flyAgain() {
    const prev = { name: S.player.name, handle: S.player.handle, emoji: S.player.emoji, hue: S.player.hue, from: S.player.from, to: S.player.to,
      tier: S.player.tier, interests: S.player.interests, carry: followersNow(now()), world: W.kind };
    $$('#overlay .wrapped').forEach(w => w.remove());
    closeAllPages();
    showBoarding(prev);
  }
  // Old saves predate some fields; fill them in so the engine never meets an undefined.
  function migrate(s) {
    ['rel', 'argue', 'learned', 'quiz', 'dmSent', 'followedBy', 'blocked', 'insults', 'apologized'].forEach(k => { if (!s[k]) s[k] = {}; });
    s.world = s.world === 'kids' && AM.KIDS ? 'kids' : 'city';
    if (!ST || ST !== (s.world === 'kids' ? AM.KIDS.STORY : AM.STORY)) useWorld(s.world);
    if (!ST.game.teams.includes(s.flight.winner)) s.flight.winner = ST.game.teams[0];
    (s.queue || []).forEach(e => { if (e.ai === 1) e.ai = 3; }); // a reply the AI was writing when the app closed keeps its fallback
    return s;
  }

  // ---------- boot ----------
  function boot(snapshot) {
    const fromHot = snapshot && snapshot.S && snapshot.S.v === 1 ? snapshot.S : null;
    S = fromHot || load();
    useWorld(S ? S.world : 'city');
    if (S) migrate(S);
    buildShell();
    document.addEventListener('click', onClick);
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(ev => document.addEventListener(ev, () => { ui.lastTouch = Date.now(); if (ev !== 'wheel') unlockAudio(); }, { passive: true }));
    $('#views').addEventListener('scroll', () => { ui.lastTouch = Date.now(); }, { capture: true, passive: true });
    $('#strip').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('#strip').click(); } });
    if (AM.AI) AM.AI.on(renderAiRow);
    // A new version installs in the background; offer a restart instead of waiting for the next launch.
    if ('serviceWorker' in navigator) {
      const had = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!had || $('#overlay .update-pill')) return;
        const b = document.createElement('button');
        b.className = 'update-pill'; b.dataset.act = 'reload-app'; b.textContent = 'New version ready · Tap to restart';
        $('#overlay').appendChild(b);
      });
    }
    if (!S) {
      // A sample world sits behind the boarding pass so the first frame shows what the app is.
      showBoarding(null);
      return;
    }
    reindex();
    if (snapshot && snapshot.tab) ui.tab = snapshot.tab;
    renderAll();
    startTicking();
    tick();
    if (AM.AI && !W.kids) AM.AI.resume();
  }

  // Diagnostics for testing and bug reports: __airplaneMode.skipTo(0.5) jumps the flight to 50%.
  window.__airplaneMode = {
    state: () => S,
    skipTo: f => { if (!S) return; S.skew = (S.skew || 0) + Math.max(0, S.flight.start + S.flight.duration * f - now()); tick(); return progress(now()); },
    post: (text, tag) => { const p = playerPost({ text, tag }); renderHome(true); return p.id; },
    choose: (who, i) => choose(who, i),
    reply: (postId, text, rid) => sendReply(postId, text, rid),
    dm: (who, text) => sendDm(who, text),
    ai: () => AM.AI,
    tick: () => tick()
  };

  const hot = window.claude && window.claude.hot;
  if (hot && hot.snapshot) { try { hot.snapshot(() => ({ S, tab: ui.tab })); } catch (e) { /* not in a viewer */ } }
  const start = data => boot(data || {});
  if (hot && hot.ready) hot.ready(start); else start((hot && hot.data) || {});
})();
