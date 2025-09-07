const cacheName = "tkb-cache-v1";
const filesToCache = [
  "/",
  "/index.html",
  "/tkb.css",
  "/tkb11.js",
  "/img/TingTingpro.png",
];

// Cài đặt và cache các file
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(filesToCache))
  );
});

// Lấy dữ liệu từ cache khi offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
