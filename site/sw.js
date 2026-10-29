// Airplane Mode service worker: makes the installed web app open with no connection at all.
// tools/build.js copies this file into dist/ and replaces __VERSION__ with a hash of the build, so every
// release changes this file and phones pick it up on their next launch with a connection.
//
// install   pre-caches the whole app (it is one HTML file plus the manifest and icons) into its own
//           versioned cache, then takes over straight away. Saved flights live in localStorage, not here,
//           so a new build never loses anyone's progress.
// activate  deletes older airplanemode-* caches only. Other apps on the same github.io address (Gate Rush)
//           keep theirs.
// fetch     the app's own files come from the cache first, so a refresh at 37,000 feet still works.
//           Google Fonts are cached the first time they load and reused offline. Anything else goes to
//           the network.
'use strict';

const VERSION = '__VERSION__';
const PREFIX = 'airplanemode-';
const APP_CACHE = PREFIX + VERSION;
const FONT_CACHE = PREFIX + 'fonts';
const PRECACHE = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-maskable-192.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then(cache => cache.addAll(PRECACHE.map(url => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== APP_CACHE && k !== FONT_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    // Every page of the app is the same single file, whatever query or hash it carries.
    if (req.mode === 'navigate') {
      event.respondWith(caches.match('./index.html', { cacheName: APP_CACHE }).then(hit => hit || fetch(req)));
      return;
    }
    event.respondWith(caches.match(req, { cacheName: APP_CACHE, ignoreSearch: true }).then(hit => hit || fetch(req)));
    return;
  }

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    // Stale-while-revalidate: use the saved font at once, refresh it in the background when online.
    event.respondWith(caches.open(FONT_CACHE).then(cache => cache.match(req).then(hit => {
      const fresh = fetch(req).then(res => { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || fresh;
    })));
  }
});
