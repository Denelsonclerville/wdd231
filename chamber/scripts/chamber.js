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

        if (!weatherContainer) {
            return;
        }

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
        let dailyHigh = null;
        let dailyLow = null;

        if (fResponse.ok) {
            const fData = await fResponse.json();
            const today = fData.list.filter(item => item.dt_txt.includes("12:00:00"))[0];

            if (today) {
                dailyHigh = Math.round(today.main.temp_max);
                dailyLow = Math.round(today.main.temp_min);
            }
        }

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
                    <p style="text-transform: capitalize;">
                        ${data.weather[0].description}
                    </p>
                    <p>
                        High: <strong>${dailyHigh !== null ? dailyHigh : Math.round(data.main.temp_max)}°F</strong>
                    </p>
                    <p>
                        Low: <strong>${dailyLow !== null ? dailyLow : Math.round(data.main.temp_min)}°F</strong>
                    </p>
                    <p>
                        Humidity: ${data.main.humidity}%
                    </p>
                    <p>
                        Sunrise: ${formatTime(data.sys.sunrise)}
                    </p>
                    <p>
                        Sunset: ${formatTime(data.sys.sunset)}
                    </p>
                </div>
            </div>
        `;

        if (!fResponse.ok) {
            if (forecastContainer) {
                forecastContainer.innerHTML = `<p class="forecast-error">Forecast unavailable.</p>`;
            }
            return;
        }

        const fData = await fResponse.json();
        const daily = fData.list.filter(item => item.dt_txt.includes("12:00:00")).slice(1, 4);

        if (forecastContainer) {
            if (daily.length === 0) {
                forecastContainer.innerHTML = `<p class="forecast-error">No forecast data available.</p>`;
            } else {
                forecastContainer.innerHTML = daily
                    .map(day => {
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

document.addEventListener("DOMContentLoaded", () => {
    getWeatherData();
    getMembersData();

    const timestampField = document.querySelector("#timestamp");
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const closeButtons = document.querySelectorAll('.close-modal');
    const dialogs = document.querySelectorAll('dialog');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                if (typeof modal.showModal === 'function') {
                    modal.showModal();
                } else {
                    modal.setAttribute('open', '');
                }
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
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
});