const friends = [
  {
    name: "careca1", cls: "careca", lane: 0,
    days: {
      1: [["18:30","22:00"]],
      3: [["00:21","24:00"]],
      4: [["10:00","13:00"]],
      5: [["16:30","23:00"]]
    }
  },
  {
    name: "CalvoLord", cls: "calvo", lane: 1,
    days: {
      2: [["02:00","09:00"],["13:00","17:45"]],
      5: [["08:00","18:00"]],
      6: [["19:00","19:30"]],
      0: [["06:00","17:15"]]
    }
  }
];

const activeFriends = new Set(
  friends.map(friend => friend.name)
);

const days = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];

const legend = document.getElementById("legend");

friends.forEach(friend => {
  const label = document.createElement("label");
  label.className = "legend-filter";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = true;
  checkbox.dataset.friend = friend.name;

  const dot = document.createElement("i");
  dot.className = "dot " + (friend.cls === "careca" ? "purple" : "blue");

  const name = document.createElement("span");
  name.className = "legend-name";
  name.textContent = friend.name;

  label.appendChild(checkbox);
  label.appendChild(dot);
  label.appendChild(name);

  legend.appendChild(label);

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      activeFriends.add(friend.name);
    } else {
      activeFriends.delete(friend.name);
    }

    updateCalendar();
  });
});

// Define as datas da semana atual
function updateWeekDates() {
  const now = new Date();

  // Cria uma cópia da data atual
  const startOfWeek = new Date(now);

  // getDay(): domingo = 0, segunda = 1, ..., sábado = 6
  startOfWeek.setDate(now.getDate() - now.getDay());

  const dayHeaders = document.querySelectorAll(".day-head");

  dayHeaders.forEach((header, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);

    const dayNumber = String(date.getDate()).padStart(2, "0");

    const small = header.querySelector("small");
    small.textContent = dayNumber;
  });
}

updateWeekDates();

const times = document.getElementById("times");
for (let i = 0; i < 48; i++) {
  const label = document.createElement("div");
  label.className = "time-label";
  label.textContent = String(Math.floor(i / 2)).padStart(2, "0") + (i % 2 ? ":30" : ":00");
  times.appendChild(label);
}
const calendar = document.getElementById("calendar");

function updateCalendar() {
  // Remove apenas os dias que foram criados pelo JavaScript
  document.querySelectorAll(".day").forEach(day => day.remove());

  days.forEach((dayName, dayIndex) => {
    const day = document.createElement("div");
    day.className = "day";
    day.setAttribute("aria-label", dayName);

    friends.forEach(friend => {

      // Se o brodinho estiver desativado no filtro, não cria seus eventos
      if (!activeFriends.has(friend.name)) {
        return;
      }

      (friend.days[dayIndex] || []).forEach(([start, end]) => {

        const toMinutes = t => {
          const [h, m] = t.split(":").map(Number);
          return h * 60 + m;
        };

        const startMin = toMinutes(start);
        const endMin = end === "24:00" ? 1440 : toMinutes(end);

        const event = document.createElement("div");

        event.className =
          "event " +
          friend.cls +
          (startMin === 0 && endMin === 1440 ? " all-day" : "");

        event.style.top = (startMin / 1440 * 100) + "%";
        event.style.height = ((endMin - startMin) / 1440 * 100) + "%";

        event.style.left = (friend.lane * 50 + 2) + "%";
        event.style.width = "46%";

        event.innerHTML =
          "<strong>" + friend.name + "</strong>" +
          "<small>" + start + "–" + end + "</small>";

        event.title =
          friend.name + " · " + start + " às " + end;

        day.appendChild(event);
      });
    });

    // Linha do horário atual
    const currentLine = document.createElement("div");
    currentLine.className = "current-time-line";
    day.appendChild(currentLine);

    calendar.appendChild(day);
  });

  updateCurrentTime();
}

function updateCurrentTime() {
  const now = new Date();

  // Domingo = 0, Segunda = 1, ..., Sábado = 6
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

updateCurrentTime();
setInterval(updateCurrentTime, 15000);

updateCalendar();
