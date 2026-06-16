/* sw.js — service worker for offline use.
 * Cache-first "app shell": after the first online visit, the calculator loads
 * and runs with no network (e.g. at the counter on a phone in Airplane mode).
 * Bump CACHE (e.g. v1 -> v2) whenever you change index.html/calc.js/products.js
 * so phones pick up the new version on their next online load.
 */
const CACHE = "daysupply-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./calc.js",
  "./products.js",
  "./manifest.webmanifest",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // Cache same-origin successful responses for next time.
          if (res && res.ok && new URL(req.url).origin === self.location.origin) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          // Offline fallback: serve the app shell for navigations.
          if (req.mode === "navigate") return caches.match("./index.html");
        });
    })
  );
});
