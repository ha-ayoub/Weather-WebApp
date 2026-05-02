const API_KEY = "9088a4fe3baa32b8b41f1c1f8d59218f";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const DAYS  = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];

const searchInput  = document.querySelector(".searchInput");
const searchBtn    = document.querySelector(".searchBtn");
const getLocationBtn = document.querySelector(".getLocation");

let tempChartInstance = null;

const kelvinToCelsius = (k) => (k - 273.15).toFixed(1);

function showToast(msg, type = "info") {
  // Remove any existing toast
  document.querySelectorAll(".toast").forEach(t => t.remove());

  const toast = document.createElement("div");
  toast.className = `toast${type === "error" ? " error" : ""}`;
  toast.textContent = msg;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("show"));
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

function formatDate(dateObj) {
  return `${DAYS[dateObj.getDay()]}, ${dateObj.getDate()} ${MONTHS[dateObj.getMonth()]}`;
}

function staggerAnimation(elements) {
  elements.forEach((el, i) => {
    el.style.animationDelay = `${i * 0.07}s`;
  });
}

async function getWeather(region) {
  try {
    const res = await fetch(`${BASE_URL}/weather?q=${encodeURIComponent(region)}&appid=${API_KEY}&lang=fr`);

    if (!res.ok) {
      if (res.status === 404) throw new Error(`Ville "${region}" introuvable.`);
      throw new Error("Erreur lors de la récupération des données.");
    }

    const data = await res.json();
    setCurrentWeather(data);

    // Also fetch forecast
    await getForecast(region);

  } catch (err) {
    showToast(err.message, "error");
    console.error(err);
  }
}

function setCurrentWeather(data) {
  document.getElementById("regionName").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("today").textContent = formatDate(new Date());

  document.getElementById("forecastIcon").innerHTML =
    `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="${data.weather[0].description}" />`;

  document.getElementById("currTemp").innerHTML     = `${kelvinToCelsius(data.main.temp)}&deg;C`;
  document.getElementById("forecast").textContent   = data.weather[0].description;

  document.querySelector(".humidity-val").textContent    = `${data.main.humidity}%`;
  document.querySelector(".wind-val").textContent        = `${data.wind.speed.toFixed(1)} m/s`;
  document.querySelector(".feel-val").innerHTML          = `${kelvinToCelsius(data.main.feels_like)}&deg;C`;
  document.querySelector(".tempMin-val").innerHTML       = `${kelvinToCelsius(data.main.temp_min)}&deg;C`;
  document.querySelector(".tempMax-val").innerHTML       = `${kelvinToCelsius(data.main.temp_max)}&deg;C`;
  document.querySelector(".visibility-val").textContent = `${(data.visibility / 1000).toFixed(1)} km`;
}

async function getForecast(region) {
  try {
    const res = await fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(region)}&appid=${API_KEY}&lang=fr`);
    if (!res.ok) throw new Error("Impossible de récupérer les prévisions.");
    const data = await res.json();

    renderForecastCards(data.list);
    renderTempChart(data.list);

  } catch (err) {
    console.error(err);
  }
}

function renderForecastCards(list) {
  const grid = document.getElementById("forecastGrid");
  grid.innerHTML = "";

  // Group by day: pick the midday entry (or closest)
  const dayMap = {};
  const todayDate = new Date().toDateString();

  list.forEach(entry => {
    const d = new Date(entry.dt * 1000);
    const key = d.toDateString();
    const hour = d.getHours();

    if (!dayMap[key]) dayMap[key] = [];
    dayMap[key].push({ entry, hour });
  });

  // Take up to 7 days
  const days = Object.keys(dayMap).slice(0, 7);

  days.forEach((dateStr, idx) => {
    const entries = dayMap[dateStr];

    // Pick midday or closest available
    const best = entries.reduce((prev, curr) =>
      Math.abs(curr.hour - 12) < Math.abs(prev.hour - 12) ? curr : prev
    );

    const e   = best.entry;
    const d   = new Date(e.dt * 1000);
    const isToday = dateStr === todayDate;

    const maxTemp = Math.max(...entries.map(x => x.entry.main.temp_max));
    const minTemp = Math.min(...entries.map(x => x.entry.main.temp_min));

    const card = document.createElement("div");
    card.className = `forecast-card${isToday ? " today-card" : ""}`;
    card.style.animationDelay = `${idx * 0.07}s`;
    card.innerHTML = `
      <div class="forecast-day">${isToday ? "Auj." : DAYS[d.getDay()]}</div>
      <img src="https://openweathermap.org/img/wn/${e.weather[0].icon}@2x.png" alt="${e.weather[0].description}" />
      <div class="forecast-temp-max">${kelvinToCelsius(maxTemp)}°</div>
      <div class="forecast-temp-min">${kelvinToCelsius(minTemp)}°</div>
    `;
    grid.appendChild(card);
  });
}

function renderTempChart(list) {
  // Take next 24 entries (72h)
  const slice = list.slice(0, 24);

  const labels = slice.map(e => {
    const d = new Date(e.dt * 1000);
    return `${DAYS[d.getDay()]} ${String(d.getHours()).padStart(2, "0")}h`;
  });

  const temps    = slice.map(e => parseFloat(kelvinToCelsius(e.main.temp)));
  const feelsLike = slice.map(e => parseFloat(kelvinToCelsius(e.main.feels_like)));

  const canvas = document.getElementById("tempChart");
  const ctx    = canvas.getContext("2d");

  // Get CSS variable colors
  const style   = getComputedStyle(document.documentElement);
  const accent  = style.getPropertyValue("--accent").trim() || "#5282ff";
  const textMuted = style.getPropertyValue("--text-muted").trim() || "rgba(240,242,248,0.5)";
  const border  = style.getPropertyValue("--border").trim() || "rgba(255,255,255,0.08)";
  const text    = style.getPropertyValue("--text").trim() || "#f0f2f8";

  if (tempChartInstance) {
    tempChartInstance.destroy();
  }

  tempChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Température (°C)",
          data: temps,
          borderColor: accent,
          backgroundColor: hexToRgba(accent, 0.12),
          borderWidth: 2.5,
          pointRadius: 3,
          pointBackgroundColor: accent,
          fill: true,
          tension: 0.45,
        },
        {
          label: "Ressenti (°C)",
          data: feelsLike,
          borderColor: hexToRgba(accent, 0.45),
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderDash: [6, 4],
          pointRadius: 0,
          fill: false,
          tension: 0.45,
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          labels: {
            color: text,
            font: { family: "'DM Sans', sans-serif", size: 12 },
            boxWidth: 16,
            padding: 20,
          }
        },
        tooltip: {
          backgroundColor: "rgba(13,15,20,0.90)",
          titleColor: text,
          bodyColor: textMuted,
          borderColor: border,
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}°C`
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textMuted,
            font: { family: "'DM Sans', sans-serif", size: 11 },
            maxTicksLimit: 8,
          },
          grid: { color: border }
        },
        y: {
          ticks: {
            color: textMuted,
            font: { family: "'DM Sans', sans-serif", size: 11 },
            callback: v => `${v}°`
          },
          grid: { color: border }
        }
      }
    }
  });
}

function hexToRgba(hex, alpha) {
  hex = hex.replace("#", "").trim();
  if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

getLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    showToast("Géolocalisation non supportée par ce navigateur.", "error");
    return;
  }

  showToast("Localisation en cours…");

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(
          `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&lang=fr`
        );
        if (!res.ok) throw new Error("Position introuvable.");
        const data = await res.json();
        setCurrentWeather(data);
        await getForecast(data.name);
        showToast(`Position détectée : ${data.name}`);
      } catch (err) {
        showToast(err.message, "error");
      }
    },
    () => showToast("Permission de localisation refusée.", "error")
  );
});

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && searchInput.value.trim()) {
    getWeather(searchInput.value.trim());
  }
});

searchBtn.addEventListener("click", () => {
  if (searchInput.value.trim()) getWeather(searchInput.value.trim());
});

getWeather("Paris");