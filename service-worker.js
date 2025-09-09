const cacheName = "tkb-cache-v1";
const basePath = "/TKB11Tin";

const filesToCache = [
<<<<<<< HEAD
  `${basePath}/`,
  `${basePath}/index.html`,
  `${basePath}/tkb.css`,
  `${basePath}/tkb11.js`,
  `${basePath}/img/TingTingpro.png`,
=======
  "index.html",
  "tkb.css",
  "tkb11.js",
  "img/TingTingpro.png",
>>>>>>> c440da661cabfcf27fc2662bd449c1fc41276169
];

self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log("[SW] Caching:", filesToCache);
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== cacheName) {
            console.log("[SW] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          if (event.request.destination === "document") {
            return caches.match(`${basePath}/index.html`);
          }
        })
      );
    })
  );
});
