const menuBtn = document.querySelector("#menu");
const navList = document.querySelector(".navigation");

if (menuBtn && navList) {
    menuBtn.addEventListener("click", () => {
        navList.classList.toggle("open");
        menuBtn.textContent = navList.classList.contains("open") ? "X" : "☰";
    });
}

const yearSpan = document.querySelector("#year");
const lastModifiedSpan = document.querySelector("#lastModified");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();
if (lastModifiedSpan) lastModifiedSpan.textContent = document.lastModified;

const apiKey = "f87506fef3f9d3690498f26dd78a2b09"; 
const lat = "18.51"; 
const lon = "-72.28";
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

async function getWeatherData() {
    try {
        const response = await fetch(weatherUrl);
        if (response.ok) {
            const data = await response.json();
            
            const tempElement = document.querySelector("#temp");
            if (tempElement) {
                tempElement.innerHTML = `${Math.round(data.main.temp)}°C`;
            }

            const iconElement = document.querySelector("#weather-icon");
            if (iconElement) {
                const iconSrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                iconElement.setAttribute('src', iconSrc);
                iconElement.setAttribute('alt', data.weather[0].description);
            }

            if (document.querySelector("#condition")) {
                document.querySelector("#condition").textContent = data.weather[0].description;
            }
            if (document.querySelector("#high")) {
                document.querySelector("#high").textContent = `High: ${Math.round(data.main.temp_max)}°`;
            }
            if (document.querySelector("#low")) {
                document.querySelector("#low").textContent = `Low: ${Math.round(data.main.temp_min)}°`;
            }
            if (document.querySelector("#humidity")) {
                document.querySelector("#humidity").textContent = `Humidity: ${data.main.humidity}%`;
            }

            const formatTime = (ts) => new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (document.querySelector("#sunrise")) {
                document.querySelector("#sunrise").textContent = `Sunrise: ${formatTime(data.sys.sunrise)}`;
            }
            if (document.querySelector("#sunset")) {
                document.querySelector("#sunset").textContent = `Sunset: ${formatTime(data.sys.sunset)}`;
            }
        }

        const fResponse = await fetch(forecastUrl);
        if (fResponse.ok) {
            const fData = await fResponse.json();
            const daily = fData.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);
            const dayIDs = ["day1", "day2", "day3"];
            
            daily.forEach((day, i) => {
                const dayElement = document.querySelector(`#${dayIDs[i]}`);
                if (dayElement) {
                    const date = new Date(day.dt * 1000).toLocaleDateString('en-US', {weekday: 'long'});
                    let dayLabel = (i === 0) ? "Today" : date;
                    dayElement.innerHTML = `${dayLabel}: <strong>${Math.round(day.main.temp)}°C</strong>`;
                }
            });
        }
    } catch (err) {
        console.error(err);
    }
}

getWeatherData();