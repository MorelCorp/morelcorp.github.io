// Gym in a Box — offline service worker
const CACHE = 'gym-in-a-box-v4';

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

// Cache-first, falling back to network and stashing successful GETs so that
// fonts/webfont files loaded at runtime become available offline next time.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(event.request, copy)).catch(() => {});
        return resp;
      }).catch(() => cached);
    })
  );
});
