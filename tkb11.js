const schedule = {
  0: [
    "Chào cờ",
    "Tin học(Lượm)",
    "Hóa học(Nữ)",
    "Tiếng Anh(Tú)",
    "Tiếng Anh(Tú)",
  ],
  1: ["Tin học(Quyên)", "Ngữ Văn(Bích)", "Toán(Tuệ)", "Tin học(Quyên)", ""],
  2: ["KTCN(Huy)", "Tin học(Quyên)", "Tin học(Lượm)", "Toán(Tuệ)", "Toán(Tuệ)"],
  3: ["Tiếng Anh(Tú)", "Vật lý(Miễn)", "GDQP(Đạt)", "", ""],
  4: ["Lịch sử(Huỳnh)", "KTCN(Huy)", "Toán(Tuệ)", "", ""],
  5: ["Ngữ Văn(Bích) ", "Ngữ Văn(Bích)", "Hóa học(Nữ)", "SHL", ""],
};

const scheduleafternoon = {
  0: ["", "", "", ""],
  1: ["", "", "GDTC(Định)", "GDTC(Định)"],
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
