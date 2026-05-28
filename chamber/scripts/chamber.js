const apiKey = "f87506fef3f9d3690498f26dd78a2b09";
const lat = "18.51";
const lon = "-72.28";

const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
const membersUrl = "./data/members.json";

let allMembers = [];

function renderWeatherError(message, weatherContainer, forecastContainer) {
    if (weatherContainer) {
        weatherContainer.innerHTML = `<p class="weather-error">${message}</p>`;
    }
    if (forecastContainer) {
        forecastContainer.innerHTML = `<p class="forecast-error">Forecast unavailable.</p>`;
    }
}

async function getWeatherData() {
    try {
        const weatherContainer = document.querySelector(".weather-content");
        const forecastContainer = document.querySelector("#forecast-list");

        const response = await fetch(weatherUrl);
        if (!response.ok) {
            renderWeatherError("Unable to load current weather at this time.", weatherContainer, forecastContainer);
            return;
        }
        const data = await response.json();

        const formatTime = (timestamp) => {
            return new Date(timestamp * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });
        };

        const fResponse = await fetch(forecastUrl);
        let dailyHigh = Math.round(data.main.temp_max);
        let dailyLow = Math.round(data.main.temp_min);
        let daily = [];

        if (fResponse.ok) {
            const fData = await fResponse.json();

            if (fData.list && fData.list.length > 0) {
                const todayElements = fData.list.slice(0, 8);
                let maxTemp = -Infinity;
                let minTemp = Infinity;

                for (let i = 0; i < todayElements.length; i++) {
                    const item = todayElements[i];
                    if (item.main.temp_max > maxTemp) {
                        maxTemp = item.main.temp_max;
                    }
                    if (item.main.temp_min < minTemp) {
                        minTemp = item.main.temp_min;
                    }
                }

                if (maxTemp !== -Infinity) dailyHigh = Math.round(maxTemp);
                if (minTemp !== Infinity) dailyLow = Math.round(minTemp);
            }

            daily = fData.list.filter(item => item.dt_txt.includes("12:00:00")).slice(1, 4);
            if (daily.length === 0 && fData.list.length >= 25) {
                daily = [fData.list[8], fData.list[16], fData.list[24]];
            }
        }

        if (weatherContainer) {
            weatherContainer.innerHTML = `
                <div class="weather-layout">
                    <img
                        id="weather-icon"
                        src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
                        alt="${data.weather[0].description}"
                    >
                    <div class="weather-info-side">
                        <p class="main-temp">
                            <strong>${Math.round(data.main.temp)}°F</strong>
                        </p>
                        <p class="main-temp" style="text-transform: capitalize;">
                            ${data.weather[0].description}
                        </p>
                        <p>
                            High: <strong>${dailyHigh}°F</strong>
                        </p>
                        <p>
                            Low: <strong>${dailyLow}°F</strong>
                        </p>
                        <p>
                            Humidity:<strong> ${data.main.humidity}%</strong>
                        </p>
                        <p>
                            Sunrise:<strong> ${formatTime(data.sys.sunrise)}</strong>
                        </p>
                        <p>
                            Sunset: <strong>${formatTime(data.sys.sunset)}</strong>
                        </p>
                    </div>
                </div>
            `;
        }

        if (forecastContainer) {
            if (!fResponse.ok) {
                forecastContainer.innerHTML = `<p class="forecast-error">Forecast unavailable.</p>`;
            } else if (daily.length === 0) {
                forecastContainer.innerHTML = `<p class="forecast-error">No forecast data available.</p>`;
            } else {
                forecastContainer.innerHTML = daily
                    .map(day => {
                        if (!day) return '';
                        const date = new Date(day.dt * 1000).toLocaleDateString("en-US", {
                            weekday: "long"
                        });
                        return `
                            <p class="forecast-day">
                                <strong>${date}:</strong> ${Math.round(day.main.temp)}°F
                            </p>
                        `;
                    })
                    .join("");
            }
        }

    } catch (err) {
        console.error("Erè Weather API:", err);
        const weatherContainer = document.querySelector(".weather-content");
        const forecastContainer = document.querySelector("#forecast-list");
        renderWeatherError("Unable to load weather information.", weatherContainer, forecastContainer);
    }
}

async function getMembersData() {
    try {
        const response = await fetch(membersUrl);
        if (!response.ok) throw new Error("not found");
        const members = await response.json();

        allMembers = members;

        const directoryContainer = document.querySelector("#business-container");
        if (directoryContainer) {
            displayDirectory(members, directoryContainer);
            setupViewButtons(directoryContainer);
        }

        const spotlightContainer = document.querySelector(".spotlight-container");
        if (spotlightContainer) {
            displaySpotlights(members, spotlightContainer);
        }
    } catch (error) {
        console.error(error);
    }
}

function displayDirectory(members, container) {
    container.innerHTML = "";
    members.forEach((m) => {
        const card = document.createElement("section");
        card.className = "business-card";
        card.innerHTML = `
            <div class="card-logo">
                <img src="images/${m.image}" alt="Logo ${m.name}" loading="lazy">
            </div>
            <h3>${m.name}</h3>
            <p class="address">${m.address}</p>
            <p class="phone">${m.phone}</p>
            <p class="url">
                <a href="https://${m.website}" target="_blank">${m.website}</a>
            </p>
        `;
        container.appendChild(card);
    });
}

function displaySpotlights(members, container, count = 3) {
    const eligible = members.filter((m) => m.membership === 2 || m.membership === 3);
    const shuffled = eligible.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    container.innerHTML = "";

    selected.forEach((m) => {
        const spotCard = document.createElement("section");
        spotCard.className = "spotlight-card";

        spotCard.innerHTML = `
            <h3>${m.name}</h3>
            <p class="tagline"><em>${m.otherInfo || "Slogan Biznis la"}</em></p>
            <hr>
            <div class="spot-info-wrapper">
                <img src="images/${m.image}" alt="Logo ${m.name}" loading="lazy">
                <div class="spot-details">
                    <p>EMAIL: <strong>${m.name.toLowerCase().replace(/\s/g, "")}@gmail.com</strong></p>
                    <p>PHONE: <strong>${m.phone}</strong></p>
                    <p>URL: <a href="https://${m.website}" target="_blank"><strong>${m.website}</strong></a></p>
                    <p>Membership: <strong>${m.membership}</strong></p>
                </div>
            </div>
        `;
        container.appendChild(spotCard);
    });
}

function randomizeSpotlights(count = 3) {
    const container = document.querySelector('.spotlight-container');
    if (!container) return;
    if (!Array.isArray(allMembers) || allMembers.length === 0) return;
    displaySpotlights(allMembers, container, count);
}

window.randomizeSpotlights = randomizeSpotlights;

function setupViewButtons(businessContainer) {
    const gridBtn = document.querySelector("#gridViewBtn");
    const listBtn = document.querySelector("#listViewBtn");

    if (gridBtn && listBtn) {
        gridBtn.addEventListener("click", () => {
            businessContainer.classList.add("grid");
            businessContainer.classList.remove("list");
            gridBtn.classList.add("active");
            listBtn.classList.remove("active");
            displayDirectory(allMembers, businessContainer);
        });

        listBtn.addEventListener("click", () => {
            businessContainer.classList.add("list");
            businessContainer.classList.remove("grid");
            listBtn.classList.add("active");
            gridBtn.classList.remove("active");
            displayDirectory(allMembers, businessContainer);
        });
    }
}

function populateThankyouDetails() {
    const resultsContainer = document.querySelector("#results");
    if (!resultsContainer) return;

    const params = new URLSearchParams(window.location.search);
    if (!params.toString()) {
        resultsContainer.innerHTML = `<p class="error">No application details were provided. Please return to the membership form and submit again.</p>`;
        return;
    }

    const summaryItems = [
        { label: 'Full Name', value: `${params.get('fname') || ''} ${params.get('lname') || ''}`.trim() },
        { label: 'Organization', value: params.get('organization') || 'Not provided' },
        { label: 'Title', value: params.get('title') || 'Not provided' },
        { label: 'Membership Level', value: params.get('level') || 'Not provided' },
        { label: 'Email', value: params.get('email') || 'Not provided' },
        { label: 'Phone', value: params.get('phone') || 'Not provided' },
        { label: 'Submitted', value: params.get('timestamp') ? new Date(params.get('timestamp')).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Not available' }
    ];

    const detailHtml = summaryItems
        .filter(item => item.value)
        .map(item => `
            <div class="summary-item">
                <dt>${item.label}</dt>
                <dd>${item.value}</dd>
            </div>
        `)
        .join('');

    resultsContainer.innerHTML = `<dl class="summary-grid">${detailHtml}</dl>`;
}

function syncHeroHeight() {
    const hero = document.querySelector('.hero');
    const target = document.querySelector('.home-container');
    if (!hero || !target) return;
    hero.style.height = 'auto';
    const height = target.getBoundingClientRect().height;
    hero.style.height = `${height}px`;
}

document.addEventListener("DOMContentLoaded", () => {
    getWeatherData();
    getMembersData();

    const timestampField = document.querySelector("#timestamp");
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    populateThankyouDetails();

    const dialogs = document.querySelectorAll("dialog");
    const closeButtons = document.querySelectorAll(".close-modal");

    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest('dialog');
            if (modal) {
                modal.close();
                const trigger = document.querySelector(`.modal-trigger[data-modal="${modal.id}"]`);
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    dialogs.forEach(dialog => {
        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
                dialog.close();
                const trigger = document.querySelector(`.modal-trigger[data-modal="${dialog.id}"]`);
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            dialogs.forEach(dialog => {
                if (dialog.open) {
                    dialog.close();
                    const trigger = document.querySelector(`.modal-trigger[data-modal="${dialog.id}"]`);
                    if (trigger) trigger.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });

    syncHeroHeight();
    window.addEventListener('load', syncHeroHeight);
    window.addEventListener('resize', () => {
        clearTimeout(window._syncHeroTimer);
        window._syncHeroTimer = setTimeout(syncHeroHeight, 120);
    });
});