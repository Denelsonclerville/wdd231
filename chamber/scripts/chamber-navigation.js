const menuBtn = document.querySelector("#menu");
const navList = document.querySelector(".navigation");

if (menuBtn && navList) {
    menuBtn.addEventListener("click", () => {
        navList.classList.toggle("show");
        
        menuBtn.classList.toggle("show");
    });
}

const yearSpan = document.querySelector("#year");
const lastModSpan = document.querySelector("#lastModified");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();
if (lastModSpan) lastModSpan.textContent = document.lastModified;

const apiKey = "f87506fef3f9d3690498f26dd78a2b09";
const lat = "18.51";
const lon = "-72.28";
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

async function getWeatherData() {
    try {
        const weatherContainer = document.querySelector(".weather-content");
        const response = await fetch(weatherUrl);

        if (response.ok && weatherContainer) {
            const data = await response.json();

            const formatTime = (timestamp) => {
                return new Date(timestamp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            };

            weatherContainer.innerHTML = `
                <div class="weather-layout">
                    <img id="weather-icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
                    <div class="weather-info-side">
                        <p class="main-temp"><strong>${Math.round(data.main.temp)}°F</strong></p>
                        <p style="text-transform: capitalize;">${data.weather[0].description}</p>
                        <p>High: ${Math.round(data.main.temp_max)}°F</strong></p>
                        <p>Low: ${Math.round(data.main.temp_min)}°F</p>
                        <p>Humidity: ${data.main.humidity}%</p>
                        <p>Sunrise: ${formatTime(data.sys.sunrise)}</p>
                        <p>Sunset: ${formatTime(data.sys.sunset)}</p>
                    </div>
                </div>
            `;
        }

        const fResponse = await fetch(forecastUrl);
        if (fResponse.ok) {
            const fData = await fResponse.json();
            const daily = fData.list.filter((item) => item.dt_txt.includes("12:00:00")).slice(0, 3);

            const forecastContainer = document.querySelector("#forecast-list");
            if (forecastContainer) {
                forecastContainer.innerHTML = daily
                    .map((day) => {
                        const date = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });
                        return `<p class="forecast-day"><strong>${date}:</strong> ${Math.round(day.main.temp)}°F</p>`;
                    })
                    .join("");
            }
        }
    } catch (err) {
        console.error("Weather Error:", err);
    }
}
getWeatherData();
