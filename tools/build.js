// Builds Airplane Mode into single self-contained pages.
//   dist/airplane-mode.html  the claude.ai artifact page (the viewer adds the document skeleton)
//   dist/play.html           a standalone page that opens in any browser, even from a file
// Usage: node tools/build.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const src = p => fs.readFileSync(path.join(root, 'src', p), 'utf8');
const JS_ALL = ['js/cast.js', 'js/content-feed.js', 'js/content-replies.js', 'js/content-tone.js', 'js/content-react.js', 'js/story.js', 'js/kids-story.js', 'js/kids-content.js', 'js/content-learn.js', 'js/art.js', 'js/faces.js', 'js/app.js'];
// Content files written in parallel may not exist yet; bundle whatever is there.
const JS = JS_ALL.filter(f => fs.existsSync(path.join(root, 'src', f)));
const missing = JS_ALL.filter(f => !JS.includes(f));
if (missing.length) console.warn('Not bundled yet: ' + missing.join(', '));

// ---- check the content against the engine's rules before bundling ----
const sandbox = { window: {}, console };
sandbox.window = sandbox;
vm.createContext(sandbox);
JS.slice(0, -1).forEach(f => vm.runInContext(src(f), sandbox, { filename: f }));
const AM = sandbox.AM;
const problems = [];
const ids = new Set(AM.CAST.map(c => c.id));
const scenes = new Set(AM.SCENES.concat(['bricks', 'oven', 'restaurant']));
AM.FEED.forEach(p => {
  if (!ids.has(p.by)) problems.push(`feed ${p.id}: unknown author ${p.by}`);
  if (p.scene && !scenes.has(p.scene)) problems.push(`feed ${p.id}: unknown scene ${p.scene}`);
  (p.replies || []).forEach(r => { if (!ids.has(r.by)) problems.push(`feed ${p.id}: unknown reply author ${r.by}`); });
});
const allStory = AM.STORY.backlog.concat(AM.STORY.beats.filter(b => b.post).map(b => b.post));
allStory.forEach(p => {
  if (p.by.charAt(0) !== '{' && !ids.has(p.by)) problems.push(`story ${p.id}: unknown author ${p.by}`);
  if (p.scene && !scenes.has(p.scene)) problems.push(`story ${p.id}: unknown scene ${p.scene}`);
  if (typeof p.text === 'object' && !p.variant) problems.push(`story ${p.id}: variant text without a variant key`);
});
AM.STORY.beats.filter(b => b.dm).forEach(b => { if (!AM.STORY.dms[b.dm]) problems.push(`beat dm ${b.dm} is not defined`); });
const voices = new Set(AM.VOICES);
Object.entries(AM.REPLIES.topics).forEach(([t, lines]) => lines.forEach(([tag]) => {
  if (!voices.has(tag) && !ids.has(tag)) problems.push(`replies ${t}: unknown tag ${tag}`);
}));
['followup', 'dm', 'dmHello'].forEach(k => AM.VOICES.forEach(v => { if (!(AM.REPLIES[k][v] || []).length) problems.push(`replies ${k}: no lines for ${v}`); }));
if (problems.length) { console.error('Content problems:\n  ' + problems.join('\n  ')); process.exit(1); }

// ---- bundle ----
const css = src('app.css');
let js = JS.map(f => `/* ---- ${f} ---- */\n` + src(f)).join('\n');
new vm.Script(js, { filename: 'bundle.js' }); // throws on a syntax error
js = js.replace(/<\/script/gi, '<\\/script');

const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&display=swap">`;
const body = `<div id="app"></div>\n<script>\n${js}\n</script>\n`;

const artifact = `<title>Airplane Mode</title>\n${fonts}\n<style>\n${css}\n</style>\n${body}`;

// The standalone page repeats the small reset the artifact viewer adds, so both behave the same. It is the
// installable web app: it links the manifest and registers the service worker (the artifact never does).
const standalone = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0D1830">
<meta name="description" content="Social media for when there's no wifi: a city of AI characters, a mystery and a feed timed to your flight.">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Airplane Mode">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<title>Airplane Mode</title>
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" href="icons/favicon-32.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
${fonts}
<style>
:root { color-scheme: light; padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }
body { margin: 0; font: 14px system-ui, sans-serif; }
img { max-width: 100%; }
[hidden] { display: none !important; }
</style>
<style>
${css}
</style>
</head>
<body>
${body}<script>if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) { try { navigator.serviceWorker.register('sw.js').catch(function () {}); } catch (e) {} }</script>
</body>
</html>
`;

// ---- write the outputs ----
//   artifact/airplane-mode.html   the claude.ai artifact page (not deployed)
//   dist/                          the GitHub Pages site: index.html, sw.js, manifest, icons
const out = (...p) => path.join(root, ...p);
fs.mkdirSync(out('artifact'), { recursive: true });
fs.writeFileSync(out('artifact', 'airplane-mode.html'), artifact);

fs.rmSync(out('dist'), { recursive: true, force: true });
fs.mkdirSync(out('dist', 'icons'), { recursive: true });
fs.writeFileSync(out('dist', 'index.html'), standalone);
fs.copyFileSync(out('site', 'manifest.webmanifest'), out('dist', 'manifest.webmanifest'));
const icons = fs.readdirSync(out('site', 'icons')).filter(f => f.endsWith('.png'));
icons.forEach(f => fs.copyFileSync(out('site', 'icons', f), out('dist', 'icons', f)));
// The worker's version is a hash of everything it caches, so each real change ships as a new worker.
const hash = require('crypto').createHash('sha256').update(standalone).update(fs.readFileSync(out('site', 'manifest.webmanifest')));
icons.forEach(f => hash.update(fs.readFileSync(out('site', 'icons', f))));
const version = 'b' + hash.digest('hex').slice(0, 12);
const sw = fs.readFileSync(out('site', 'sw.js'), 'utf8');
const precached = (sw.match(/'\.\/icons\/[^']+'/g) || []).map(s => s.slice(9, -1));
const missingIcons = precached.filter(f => !icons.includes(f));
if (missingIcons.length) { console.error('sw.js precaches icons that do not exist: ' + missingIcons.join(', ')); process.exit(1); }
fs.writeFileSync(out('dist', 'sw.js'), sw.replace("const VERSION = '__VERSION__';", "const VERSION = '" + version + "';"));

const kb = n => (Buffer.byteLength(n) / 1024).toFixed(0) + ' KB';
console.log(`Built artifact/airplane-mode.html (${kb(artifact)}) and the Pages site in dist/ (index.html ${kb(standalone)}, ${icons.length} icons, worker ${version}).`);
console.log(`Content: ${AM.CAST.length} accounts, ${AM.FEED.length} feed posts, ${allStory.length} story posts, ` +
  `${Object.values(AM.REPLIES.topics).reduce((a, l) => a + l.length, 0)} reply lines.`);
