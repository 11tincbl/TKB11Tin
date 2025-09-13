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
    caches.open(cacheName).then((cache) => cache.addAll(filesToCache))
  );
  // NOTE: we keep skipWaiting optional — we'll prefer skip via message for safer flow
  // self.skipWaiting();
});

// allow page to tell SW to activate immediately
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating and cleaning old cache...");
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== cacheName) return caches.delete(key);
          })
        );
      })
      .then(() => {
        // claim clients after cleaning
        return self.clients.claim();
      })
      .then(() => {
        // notify all window clients that SW updated and they should reload
        return self.clients
          .matchAll({ type: "window", includeUncontrolled: true })
          .then((clients) => {
            clients.forEach((client) => {
              client.postMessage({ type: "SW_UPDATED" });
            });
          });
      })
  );
});

// network-first with cache update (as suggested earlier)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(cacheName).then((cache) => {
      return fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            event.request.method === "GET"
          ) {
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
