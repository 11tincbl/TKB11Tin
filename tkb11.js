const schedule = {
  0: [
    "Chào cờ",
    "Công nghệ",
    "Hóa học",
    "Ngữ Văn",
    "Ngữ Văn",
  ],
  1: ["Vật lí", "Lịch sử", "Toán", "Toán", ""],
  2: ["Toán", "Lịch sử", "Tin học(Lượm)", "Tin(Quyên)", "Tin(Quyên)"],
  3: ["Toán", "Công nghệ", "GDQP", "Vật lí", "Tin(Lượm)"],
  4: ["Vật lí", "Hóa học", "Tin(Quyên)", "Tiếng Anh", "Tiếng Anh"],
  5: ["Tiếng Anh ", "Ngữ Văn", "SHL", "", ""],
};

const scheduleafternoon = {
  0: ["", "GDQP", "GDQP", ""],
  1: ["GDTC", "GDTC", "", ""],
  2: ["HĐTN(Nữ)", "HĐTN(Nữ) ", "HĐTN(Nữ)", ""],
  3: ["", "", "", ""],
  4: ["", "", "", ""],
  5: ["", "", "", "", ""],
};

function render_schedule() {
  const today = new Date();
  const curday = today.getDay();
  const nextday = (curday + 1) % 7;

  const tbody = document.querySelector("#tkb tbody");
  const dateinfo = document.getElementById("date-info");

  const option = {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const todaystr = today.toLocaleDateString("vi-VN", option);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowstr = tomorrow.toLocaleDateString("vi-VN", option);
  dateinfo.textContent = `Hôm nay ${todaystr} | Ngày mai ${tomorrowstr}`;

  tbody.innerHTML = "";

  for (let i = 1; i <= 5; i++) {
    const row = document.createElement("tr");
    const tietcell = document.createElement("td");
    tietcell.textContent = i;
    row.appendChild(tietcell);
    for (let j = 0; j < 6; j++) {
      const todaycell = document.createElement("td");
      todaycell.textContent = schedule[j]?.[i - 1] || "";
      row.appendChild(todaycell);
    }
    tbody.appendChild(row);
  }
  const tbody2 = document.querySelector("#tkbchieu tbody");
  tbody2.innerHTML = "";
  for (let i = 1; i < 5; i++) {
    const row = document.createElement("tr");
    const tietcell2 = document.createElement("td");
    tietcell2.textContent = i;
    row.appendChild(tietcell2);
    for (let j = 0; j <= 5; j++) {
      const aftercell = document.createElement("td");
      aftercell.textContent = scheduleafternoon[j]?.[i - 1] || "";
      row.appendChild(aftercell);
    }
    tbody2.appendChild(row);
  }
}

function balancetable() {
  const morning = document.querySelector("#tkb tbody tr").length;
  const afternoon = document.querySelector("#tkbchieu tbody tr").length;
  const tbody2 = document.querySelector("#tkbchieu tbody");
  if (afternoon < morning) {
    for (let i = afternoon + 1; i <= morning; i++) {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${i}</td>` + "<td></td>".repeat(6);
      tbody2.appendChild(row);
    }
  }
}
render_schedule();
balancetable();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/TKB11Tin/service-worker.js")
    .then((reg) => {
      console.log("SW registered", reg);

      // If there's a waiting SW (already installed but waiting), ask it to skip waiting
      if (reg.waiting) {
        reg.waiting.postMessage({ type: "SKIP_WAITING" });
      }

      // When an update is found (new SW installing)
      reg.addEventListener("updatefound", () => {
        const newSW = reg.installing;
        newSW.addEventListener("statechange", () => {
          if (newSW.state === "installed") {
            // If there's already a controller, that means update available
            if (navigator.serviceWorker.controller) {
              // tell the new SW to skipWaiting immediately
              newSW.postMessage({ type: "SKIP_WAITING" });
            }
          }
        });
      });
    });

  // When controller changes, page is now controlled by the new SW -> reload once
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  // Listen to messages from SW (e.g., SW_UPDATED)
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SW_UPDATED") {
      // Optional: show UI "New version available" and let user decide
      // Or force reload:
      window.location.reload();
    }
  });
}
