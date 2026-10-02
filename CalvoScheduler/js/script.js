const friends = [
  {
    name: "careca1", cls: "careca", lane: 0,
    days: {
      0: [["18:30","22:00"]],
      2: [["00:21","24:00"]],
      3: [["10:00","13:00"]],
      4: [["16:30","23:00"]]
    }
  },
  {
    name: "CalvoLord", cls: "calvo", lane: 1,
    days: {
      1: [["02:00","09:00"],["13:00","17:45"]],
      4: [["08:00","18:00"]],
      5: [["19:00","19:30"]],
      6: [["06:00","17:15"]]
    }
  }
];
const days = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const times = document.getElementById("times");
for (let i = 0; i < 48; i++) {
  const label = document.createElement("div");
  label.className = "time-label";
  label.textContent = String(Math.floor(i / 2)).padStart(2, "0") + (i % 2 ? ":30" : ":00");
  times.appendChild(label);
}
const calendar = document.getElementById("calendar");
days.forEach((dayName, dayIndex) => {
  const day = document.createElement("div");
  day.className = "day";
  day.setAttribute("aria-label", dayName);
  friends.forEach(friend => {
    (friend.days[dayIndex] || []).forEach(([start, end]) => {
      const toMinutes = t => {
        const [h,m] = t.split(":").map(Number);
        return h * 60 + m;
      };
      const startMin = toMinutes(start);
      const endMin = end === "24:00" ? 1440 : toMinutes(end);
      const event = document.createElement("div");
      event.className = "event " + friend.cls + (startMin === 0 && endMin === 1440 ? " all-day" : "");
      event.style.top = (startMin / 1440 * 100) + "%";
      event.style.height = ((endMin - startMin) / 1440 * 100) + "%";
      event.style.left = (friend.lane * 50 + 2) + "%";
      event.style.width = "46%";
      event.innerHTML = "<strong>" + friend.name + "</strong><small>" + start + "–" + end + "</small>";
      event.title = friend.name + " · " + start + " às " + end;
      day.appendChild(event);
    });
  });
  const currentLine = document.createElement("div");
  currentLine.className = "current-time-line";
  day.appendChild(currentLine);
  calendar.appendChild(day);
});

function updateCurrentTime() {
  const now = new Date();

  // JavaScript: domingo = 0, segunda = 1...
  // Nosso calendário: segunda = 0, domingo = 6
  const todayIndex = now.getDay();

  const minutes = now.getHours() * 60 + now.getMinutes();

  document.querySelectorAll(".day").forEach((day, index) => {
    const line = day.querySelector(".current-time-line");

    if (index === todayIndex) {
      line.style.display = "block";
      line.style.top = minutes + "px";
    } else {
      line.style.display = "none";
    }
  });
}

// Atualiza imediatamente e depois a cada 15 segundos
updateCurrentTime();
setInterval(updateCurrentTime, 15000);