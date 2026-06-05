const jsonPath = "data/organization.json";
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
  const formatTime = (ts) =>
    new Date(ts * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  const midDay = fData.list.filter((item) =>
    item.dt_txt.includes("12:00:00"),
  )[0];
  const high = midDay
    ? Math.round(midDay.main.temp_max)
    : Math.round(data.main.temp_max);
  const low = midDay
    ? Math.round(midDay.main.temp_min)
    : Math.round(data.main.temp_min);

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
  const daily = fData.list
    .filter((item) => item.dt_txt.includes("12:00:00"))
    .slice(1, 4);
  container.innerHTML = daily
    .map((day) => {
      const date = new Date(day.dt * 1000).toLocaleDateString("en-US", {
        weekday: "short",
      });
      return `
            <div class="forecast-item">
                <span class="day">${date}</span>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="icon">
                <span class="temp">${Math.round(day.main.temp)}°F</span>
            </div>`;
    })
    .join("");
}

async function initFeaturedOrgs() {
  const featuredContainer = document.querySelector("#featured-orgs-container");
  if (!featuredContainer) return;

  try {
    const response = await fetch(jsonPath);
    const organizations = await response.json();
    const shuffled = [...organizations].sort(() => 0.5 - Math.random());
    const featured = shuffled.slice(0, 3);

    featuredContainer.innerHTML = featured
      .map(
        (org) => `
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
            </div>`,
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
}

async function initDirectory() {
  const orgList = document.querySelector("#org-list");
  const countDisplay = document.querySelector("#org-count-display");

  if (!orgList) return;

  const modalElement = createModal();
  let currentLimit = 8;
  let currentData = [];
  let currentShowFounded = false;

  try {
    const response = await fetch(jsonPath);
    let organizations = await response.json();
    currentData = organizations;

    let loadMoreBtn = document.querySelector("#load-more-btn");
    if (!loadMoreBtn) {
      loadMoreBtn = document.createElement("button");
      loadMoreBtn.id = "load-more-btn";
      loadMoreBtn.className = "details-btn-styled";
      loadMoreBtn.style.display = "block";
      loadMoreBtn.style.margin = "30px auto";
      orgList.parentNode.insertBefore(loadMoreBtn, orgList.nextSibling);
    }

    const render = () => {
      const visibleData = currentData.slice(0, currentLimit);

      if (countDisplay) {
        countDisplay.textContent = `Showing ${visibleData.length} of ${currentData.length} organizations`;
      }

      orgList.innerHTML = visibleData
        .map((org) => {
          const descriptionText = org.description
            ? org.description
            : org.mission
              ? org.mission.substring(0, 85) + "..."
              : "";
          const phoneText = org.phone ? org.phone : "N/A";
          const foundedText = org.founded ? org.founded : "N/A";

          return `
                <div class="organization-card">
                    <div class="card-top">
                        <h3>${org.name}</h3>
                        <p class="category-label">${org.category}</p>
                    </div>
                    <hr class="card-divider">
                    <div class="card-middle">
                        <div class="card-text">
                            <p class="dynamic-info">
                                <strong>${currentShowFounded ? "Founded: " + foundedText : "Phone: " + phoneText}</strong>
                            </p>
                            <p class="mission-text">${descriptionText}</p>
                        </div>
                        <div class="card-image-wrapper">
                            <img src="${org.image}" alt="${org.name}" class="small-thumb" loading="lazy">
                        </div>
                    </div>
                    <div class="card-bottom">
                        <button class="details-btn-styled see-more-btn" data-name="${org.name}">See More</button>
                    </div>
                </div>`;
        })
        .join("");

      document.querySelectorAll(".see-more-btn").forEach((btn) => {
        btn.onclick = () => {
          const org = currentData.find((o) => o.name === btn.dataset.name);
          showModal(org, modalElement);
        };
      });

      if (currentLimit >= currentData.length) {
        loadMoreBtn.style.display = "none";
      } else {
        loadMoreBtn.style.display = "block";
        loadMoreBtn.innerHTML = `More <span class="arrow-down">▼</span>`;
      }
    };

    loadMoreBtn.onclick = () => {
      currentLimit = currentData.length;
      render();
    };

    const filterAll = document.querySelector("#filter-all");
    const filterNew = document.querySelector("#filter-new");
    const filterOld = document.querySelector("#filter-old");

    if (filterAll) {
      filterAll.onclick = (e) => {
        setActive(e.target);
        currentData = organizations;
        currentLimit = 9;
        currentShowFounded = false;
        render();
      };
    }
    if (filterNew) {
      filterNew.onclick = (e) => {
        setActive(e.target);
        currentData = [...organizations].sort((a, b) => b.founded - a.founded);
        currentLimit = 9;
        currentShowFounded = true;
        render();
      };
    }
    if (filterOld) {
      filterOld.onclick = (e) => {
        setActive(e.target);
        currentData = [...organizations].sort((a, b) => a.founded - b.founded);
        currentLimit = 9;
        currentShowFounded = true;
        render();
      };
    }

    function setActive(btn) {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    }

    render();
  } catch (err) {
    console.error(err);
  }
}

function createModal() {
  let modal = document.querySelector("#org-modal");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "org-modal";
  modal.className = "modal hidden";
  modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal" aria-label="Close modal">&times;</button>
            <div id="modal-body"></div>
        </div>`;
  document.body.appendChild(modal);

  modal.querySelector(".close-modal").onclick = () => {
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  };

  return modal;
}

function showModal(org, modal) {
  const body = modal.querySelector("#modal-body");
  body.innerHTML = `
        <div class="modal-header">
            <img src="${org.image}" alt="${org.name}" class="modal-logo">
            <h2>${org.name}</h2>
            <p class="modal-category">${org.category}</p>
        </div>
        <div class="modal-grid-info">
            <p><strong>📍 Location:</strong> ${org.location || "N/A"}</p>
            <p><strong> Address:</strong> ${org.address || "N/A"}</p>
            <p><strong>📞 Phone:</strong> ${org.phone || "N/A"}</p>
            <p><strong>📅 Founded:</strong> ${org.founded || "N/A"}</p>
        </div>
        <div class="modal-detailed-content">
            <h3>Mission</h3>
            <p>${org.mission || "N/A"}</p>
            <h3>Key Programs</h3>
            <p>${org.programs || "N/A"}</p>
            <h3>Community Impact</h3>
            <p>${org.impact || "N/A"}</p>
        </div>
        <div class="modal-footer-btn">
            <a href="${org.website || "#"}" target="_blank" class="button button-primary">Visit Official Website</a>
        </div>`;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

let slideIndex = 0;
let allOrgs = [];

async function initContactPage() {
  const wrapper = document.querySelector("#slides-wrapper");
  if (wrapper) {
    try {
      const response = await fetch(jsonPath);
      allOrgs = await response.json();

      const startSlideshow = () => {
        wrapper.style.opacity = "0";
        setTimeout(() => {
          wrapper.innerHTML = "";
          for (let i = 0; i < 3; i++) {
            const index = (slideIndex + i) % allOrgs.length;
            const org = allOrgs[index];
            const slide = document.createElement("div");
            slide.className = "slide-item fade-in";
            slide.innerHTML = `
                            <img src="${org.image}" alt="${org.name}">
                            <p class="org-name-slide">${org.name}</p>
                            <a href="${org.website}" target="_blank" class="button button-primary slide-visit-btn">Visit Website</a>`;
            wrapper.appendChild(slide);
          }
          wrapper.style.opacity = "1";
          slideIndex = (slideIndex + 3) % allOrgs.length;
        }, 800);
      };

      startSlideshow();
      setInterval(startSlideshow, 15000);
    } catch (err) {
      console.error(err);
    }
  }

  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    const errorBanner = document.createElement("div");
    errorBanner.id = "error-banner";
    errorBanner.style.display = "none";
    contactForm.prepend(errorBanner);

    const fields = [
      "fname",
      "lname",
      "phone",
      "email",
      "org-choice",
      "description",
    ];
    const timestamp = document.querySelector("#timestamp");

    if (timestamp) timestamp.value = new Date().toISOString();

    fields.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const saved = localStorage.getItem(`contact_${id}`);
      if (saved) el.value = saved;

      el.addEventListener("input", () => {
        localStorage.setItem(`contact_${id}`, el.value);
      });
    });

    contactForm.addEventListener("submit", (e) => {
      const inputs = contactForm.querySelectorAll(
        "input[required], select[required], textarea[required]",
      );
      let firstInvalid = null;
      let hasError = false;

      inputs.forEach((input) => {
        if (!input.checkValidity()) {
          if (!hasError) firstInvalid = input;
          hasError = true;
        }
      });

      if (hasError) {
        e.preventDefault();
        errorBanner.innerHTML = `
                    <div style="background:#fee2e2; border:1px solid #f87171; padding:15px; margin-bottom:20px; border-radius:8px; color:#b91c1c;">
                        <p style="margin:0;">Attention: Some required fields are missing.
                        <a href="#" id="go-to-error" style="text-decoration:underline; font-weight:bold; color:#b91c1c;">Click to see where.</a></p>
                    </div>`;
        errorBanner.style.display = "block";

        document.getElementById("go-to-error").onclick = (ev) => {
          ev.preventDefault();
          if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        };
      } else {
        errorBanner.style.display = "none";
        fields.forEach((id) => localStorage.removeItem(`contact_${id}`));
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getWeatherData();
  initFeaturedOrgs();
  initDirectory();
  initContactPage();
});
