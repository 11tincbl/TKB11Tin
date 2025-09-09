// ===================== //
// PHẦN ĐẦU TIÊN: Khai báo //
// ===================== //

const cacheName = "tkb-cache-v1";
const basePath = "/TKB11Tin";

const filesToCache = [
  `${basePath}/`,
  `${basePath}/index.html`,
  `${basePath}/tkb.css`,
  `${basePath}/tkb11.js`,
  `${basePath}/img/TingTingpro.png`,
];

// ===================== //
// INSTALL EVENT //
// ===================== //
self.addEventListener("install", (event) => {
  console.log("[SW] Installing and caching files...");

  // Cache toàn bộ file
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log("[SW] Caching:", filesToCache);
      return cache.addAll(filesToCache);
    })
  );

  // Bỏ qua trạng thái "waiting", update ngay lập tức
  self.skipWaiting();
});

// ===================== //
// ACTIVATE EVENT //
// ===================== //
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating and cleaning old cache...");

  // Xóa cache cũ
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

  // SW mới điều khiển toàn bộ trang ngay lập tức
  return self.clients.claim();
});

// ===================== //
// FETCH EVENT //
// ===================== //
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          // Nếu offline và request là file HTML thì trả về index.html
          if (event.request.destination === "document") {
            return caches.match(`${basePath}/index.html`);
          }
        })
      );
    })
  );
});
