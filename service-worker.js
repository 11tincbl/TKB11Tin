// 🔹 Đặt ngay đầu file
// Đảm bảo SW được update ngay khi có phiên bản mới
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Bỏ qua trạng thái "waiting", update ngay lập tức
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim()); // Cho SW mới điều khiển toàn bộ trang
});

// ===================== //
// PHẦN CODE CACHE CỦA BẠN //
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

// Khi cài đặt SW -> cache toàn bộ file
self.addEventListener("install", (event) => {
  console.log("[SW] Installing and caching files...");
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log("[SW] Caching:", filesToCache);
      return cache.addAll(filesToCache);
    })
  );
});

// Khi SW được activate -> xóa cache cũ
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating and cleaning old cache...");
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
});

// Khi fetch -> trả về từ cache hoặc mạng
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
