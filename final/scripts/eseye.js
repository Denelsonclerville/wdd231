const apiKey = "f87506fef3f9d3690498f26dd78a2b09";
const lat = "18.51";
const lon = "-72.28";
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

async function getWeatherData() {
    const weatherContainer = document.querySelector(".weather-content");
    const forecastContainer = document.querySelector("#forecast-list");

    if (!weatherContainer && !forecastContainer) return;

    try {
        const wResponse = await fetch(weatherUrl);
        const fResponse = await fetch(forecastUrl);

        if (wResponse.ok && fResponse.ok) {
            const wData = await wResponse.json();
            const fData = await fResponse.json();

            if (weatherContainer) renderWeather(wData, fData, weatherContainer);
            if (forecastContainer) renderForecast(fData, forecastContainer);
        }
    } catch (err) {
        console.error(err);
    }
}

function renderWeather(data, fData, container) {
    const formatTime = (ts) => new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const midDay = fData.list.filter(item => item.dt_txt.includes("12:00:00"))[0];
    const high = midDay ? Math.round(midDay.main.temp_max) : Math.round(data.main.temp_max);
    const low = midDay ? Math.round(midDay.main.temp_min) : Math.round(data.main.temp_min);

    container.innerHTML = `
        <div class="weather-main">
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon">
            <span class="temp-big">${Math.round(data.main.temp)}°F</span>
            <p class="condition" style="text-transform: capitalize;">${data.weather[0].description}</p>
        </div>
        <div class="weather-details">
            <p>High: <strong>${high}°F</strong></p>
            <p>Low: <strong>${low}°F</strong></p>
            <p>Humidity: <strong>${data.main.humidity}%</strong></p>
            <p>Sunrise: <strong>${formatTime(data.sys.sunrise)}</strong></p>
        </div>`;
}

function renderForecast(fData, container) {
    const daily = fData.list.filter(item => item.dt_txt.includes("12:00:00")).slice(1, 4);
    container.innerHTML = daily.map(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: 'short' });
        return `
            <div class="forecast-item">
                <span class="day">${date}</span>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="icon">
                <span class="temp">${Math.round(day.main.temp)}°F</span>
            </div>`;
    }).join("");
}

async function initFeaturedOrgs() {
    const featuredContainer = document.querySelector("#featured-orgs-container");
    if (!featuredContainer) return;

    try {
        const response = await fetch('data/organizations.json');
        const organizations = await response.json();
        const shuffled = [...organizations].sort(() => 0.5 - Math.random());
        const featured = shuffled.slice(0, 3);

        featuredContainer.innerHTML = featured.map(org => `
            <div class="organization-card">
                <div class="card-top">
                    <h3>${org.name}</h3>
                    <p class="category-label">${org.category}</p>
                </div>
                <hr class="card-divider">
                <div class="card-middle">
                    <div class="card-text">
                        <p class="mission-text">${org.mission.substring(0, 80)}...</p>
                    </div>
                    <div class="card-image-wrapper">
                        <img src="${org.image}" alt="${org.name}" class="small-thumb">
                    </div>
                </div>
            </div>`).join('');
    } catch (err) {
        console.error(err);
    }
}

function createModal() {
    let modal = document.querySelector("#org-modal");
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = "org-modal";
    modal.className = "modal hidden";
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div id="modal-body"></div>
        </div>`;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector(".close-modal");
    closeBtn.onclick = () => modal.classList.add("hidden");
    window.onclick = (event) => { if (event.target == modal) modal.classList.add("hidden"); };
    return modal;
}

async function initDirectory() {
    const orgList = document.querySelector("#org-list");
    const categoryButtons = document.querySelector("#category-buttons");
    if (!orgList) return;

    const modalElement = createModal();

    try {
        const response = await fetch('data/organizations.json');
        const organizations = await response.json();
        const savedCategory = localStorage.getItem("selectedCategory") || "All";

        const render = (filter) => {
            const filtered = filter === "All" ? organizations : organizations.filter(o => o.category === filter);
            orgList.innerHTML = filtered.map(org => `
                <div class="organization-card">
                    <div class="card-top">
                        <h3>${org.name}</h3>
                        <p class="category-label">${org.category}</p>
                    </div>
                    <hr class="card-divider">
                    <div class="card-middle">
                        <div class="card-text">
                            <p class="mission-text">${org.description || "No description available."}</p>
                        </div>
                        <div class="card-image-wrapper">
                            <img src="${org.image}" alt="${org.name}" class="small-thumb">
                        </div>
                    </div>
                    <div class="card-bottom">
                        <button class="details-btn-styled" data-id="${org.id}">More Details</button>
                    </div>
                </div>`).join('');

            document.querySelectorAll(".details-btn-styled").forEach(btn => {
                btn.onclick = () => {
                    const org = organizations.find(o => o.id == btn.dataset.id);
                    if (org) {
                        document.querySelector("#modal-body").innerHTML = `
                            <h2>${org.name}</h2>
                            <p><strong>Mission:</strong> ${org.mission}</p>
                            <p><strong>Phone:</strong> ${org.phone}</p>
                            <p><a href="${org.website}" target="_blank">Official Website</a></p>`;
                        modalElement.classList.remove("hidden");
                    }
                };
            });
        };

        const categories = ["All", ...new Set(organizations.map(o => o.category))];
        if (categoryButtons) {
            categoryButtons.innerHTML = categories.map(cat => 
                `<button class="filter-btn ${cat === savedCategory ? 'active' : ''}">${cat}</button>`
            ).join('');

            document.querySelectorAll(".filter-btn").forEach(btn => {
                btn.onclick = () => {
                    const cat = btn.textContent;
                    localStorage.setItem("selectedCategory", cat);
                    render(cat);
                    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                };
            });
        }
        render(savedCategory);
    } catch (err) {
        console.error(err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getWeatherData();
    initFeaturedOrgs();
    initDirectory();
    
    const yearSpan = document.querySelector("#year");
    const lastModSpan = document.querySelector("#lastModified");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    if (lastModSpan) lastModSpan.textContent = document.lastModified;
});