const cacheName = "tkb-cache-v2";
const basePath = "/TKB11Tin";

const filesToCache = [
  `${basePath}/`,
  `${basePath}/index.html`,
  `${basePath}/tkb.css`,
  `${basePath}/tkb11.js`,
  `${basePath}/img/TingTingpro.png`,
];

self.addEventListener("install", (event) => {
  console.log("[SW] Installing and caching files...");
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log("[SW] Caching:", filesToCache);
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating and cleaning old cache...");
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== cacheName) {
              console.log("[SW] Removing old cache:", key);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(cacheName).then((cache) => {
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => {
          return cache.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            if (event.request.destination === "document") {
              return cache.match(`${basePath}/index.html`);
            }
          });
        });
    })
  );
});
