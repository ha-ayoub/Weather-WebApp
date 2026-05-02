const toggleBtn  = document.querySelector(".toggleMode");
const toggleIcon = toggleBtn.querySelector("i");

const STORAGE_KEY = "skywatcher-theme";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  if (theme === "light") {
    toggleIcon.className = "ri-sun-line";
    toggleBtn.title = "Passer en mode sombre";
  } else {
    toggleIcon.className = "ri-moon-line";
    toggleBtn.title = "Passer en mode clair";
  }

  setTimeout(() => {
    if (typeof renderTempChart === "function" && window._lastForecastList) {
      renderTempChart(window._lastForecastList);
    }
  }, 80);
}

toggleBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem(STORAGE_KEY, next);
  applyTheme(next);
});

(function init() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }
})();