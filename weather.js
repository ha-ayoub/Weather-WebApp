const apiKey = "70ae6f4643be63a02df22cf151e6087e";
const searchInput = document.querySelector(".searchInput");
const searchBtn = document.querySelector(".searchBtn");

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

const getWeather = async (region) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${region}&appid=${apiKey}`;
  const res = await fetch(apiUrl);
  const data = await res.json();
  setWeather(data);
};

const setWeather = (data) => {
  const regionName = document.querySelector(".regionName");
  const forecastIcon = document.querySelector(".forecastIcon");
  const forecastInfo = document.querySelector(".forecast");
  const currTemp = document.querySelector(".temp");
  const humidity = document.querySelector(".humidity .value");
  const windSpeed = document.querySelector(".windSpeed .value");
  const realFeel = document.querySelector(".realFeel .value");
  const tempMin = document.querySelector(".tempMin .value");
  const tempMax = document.querySelector(".tempMax .value");
  const visibility = document.querySelector(".visibility .value");
  const currDate = document.querySelector(".today");
  const date = new Date();
  const today = `${days[date.getDay()]}, ${date.getDate()} ${
    months[date.getMonth()]
  }`;

  currDate.innerHTML = today;
  regionName.innerHTML = `${data.name}, ${data.sys.country}`;

  forecastIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png">`;
  console.log(data.weather[0].icon)

  forecastInfo.innerHTML = data.weather[0].main;
  currTemp.innerHTML = `${(data.main.temp - 273.15).toFixed(1)}&degC`;
  humidity.innerHTML = `${data.main.humidity}%`;
  windSpeed.innerHTML = `${data.wind.speed.toFixed(1)}m/s`;
  realFeel.innerHTML = `${(data.main.feels_like - 273.15).toFixed(1)}&degC`;
  tempMin.innerHTML = `${(data.main.temp_min - 273.15).toFixed(1)}&degC`;
  tempMax.innerHTML = `${(data.main.temp_max - 273.15).toFixed(1)}&degC`;
  visibility.innerHTML = `${data.visibility / 1000}km`;
};

searchInput.addEventListener("keyup", (e) => {
  if (e.keyCode == 13) {
    getWeather(searchInput.value);
  }
});

searchBtn.addEventListener("click", () => {
  getWeather(searchInput.value);
});

getWeather('Paris')
