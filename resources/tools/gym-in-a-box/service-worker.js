// Gym in a Box — offline service worker
const CACHE = 'gym-in-a-box-v6';

// Local assets that make up the app shell.
const SHELL = [
  './gym-in-a-box.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png'
];

// External assets (fonts, icon webfont). Cached opportunistically — a failure
// to pre-cache these must not break installation, so they are best-effort.
const EXTERNAL = [
  'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(async cache => {
      await cache.addAll(SHELL);
      await Promise.allSettled(
        EXTERNAL.map(url =>
          fetch(url, { mode: 'no-cors' }).then(r => cache.put(url, r)).catch(() => {})
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Two strategies:
//  • Navigations / the app HTML → NETWORK-FIRST so a fresh deploy shows up
//    immediately when online; fall back to the cached shell when offline.
//  • Everything else (fonts, webfont, icons) → CACHE-FIRST, stashing
//    successful GETs so they become available offline next time.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const isHTML = req.mode === 'navigate' ||
    (req.destination === 'document') ||
    /\.html(\?|$)/.test(new URL(req.url).pathname);

  if (isHTML) {
    event.respondWith(
      fetch(req).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return resp;
      }).catch(() => caches.match(req).then(c => c || caches.match('./gym-in-a-box.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return resp;
      }).catch(() => cached);
    })
  );
});
