const menuButton = document.querySelector("#menu");
const navigation = document.querySelector(".navigation");

menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");
});
document.querySelector("#year").textContent =
new Date().getFullYear();

document.querySelector("#lastModified").textContent =
document.lastModified;

const apiKey = "YOUR_API_KEY";
const url =
`https://api.openweathermap.org/data/2.5/weather?q=Port-au-Prince,HT&units=metric&appid=${apiKey}`;

const forecastUrl =
`https://api.openweathermap.org/data/2.5/forecast?q=Port-au-Prince,HT&units=metric&appid=${apiKey}`;

async function getWeather(){
document.querySelector("#temp").textContent = "Temperature: 28°C";
document.querySelector("#condition").textContent = "Condition: Sunny";
document.querySelector("#humidity").textContent = "Humidity: 65%";
document.querySelector("#wind").textContent = "Wind: 10 km/h";
}

async function getForecast(){
document.querySelector("#day1").textContent = "Day 1: 27°C, Partly Cloudy";
document.querySelector("#day2").textContent = "Day 2: 29°C, Sunny";
document.querySelector("#day3").textContent = "Day 3: 26°C, Rainy";
}

getWeather();
getForecast();