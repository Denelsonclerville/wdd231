import { discoveries } from "../data/discover.mjs";
const today = Date.now();
const msInDay = 86400000;

const grid = document.querySelector("#discover-grid-container");
if (grid && discoveries) {
    discoveries.forEach((item, index) => {
        const card = document.createElement("section");
        card.className = `discover-card card-${index + 1}`;
        card.innerHTML = `
            <h2 class="discover-card-title">${item.title}</h2>
            <figure class="discover-figure">
                <img src="${item.image}" alt="${item.title}" loading="lazy" width="300" height="200" class="discover-img">
            </figure>
            <address class="discover-address">${item.address}</address>
            <p class="discover-desc">${item.description}</p>
            <button class="discover-btn">Learn More</button>`;
        grid.appendChild(card);
    });
}

const msg = document.querySelector("#discover-visitor-msg");
if (msg) {
    const lastVisit = window.localStorage.getItem("last-visit-ls");
    if (!lastVisit) {
        msg.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const daysBetween = Math.floor((today - parseInt(lastVisit)) / msInDay);
        if (daysBetween < 1) {
            msg.textContent = "Welcome back to the discover page!";
        } else {
            msg.textContent = `You last visited ${daysBetween} ${daysBetween === 1 ? "day" : "days"} ago.`;
        }
    }
    window.localStorage.setItem("last-visit-ls", today.toString());
}

document.addEventListener("DOMContentLoaded", () => {
    const timestampField = document.querySelector("#timestamp");
    if (timestampField) {
        timestampField.value = new Date().toISOString();
        document.querySelectorAll(".card").forEach((card, i) => {
            card.style.animationDelay = `${(i + 1) * 0.2}s`;
            card.classList.add("animate-card");
        });
    }

    const resultsContainer = document.querySelector("#results");
    if (resultsContainer) {
        const params = new URLSearchParams(window.location.search);
        const fields = ["fname", "lname", "email", "phone", "organization", "timestamp"];
        const labels = ["First Name", "Last Name", "Email", "Phone", "Business", "Date"];

        let html = `<div class="results-card"><h2>Submission Details</h2>`;
        fields.forEach((field, i) => {
            let val = params.get(field) || "Not provided";
            if (field === "timestamp" && val !== "Not provided") val = new Date(val).toLocaleString();
            html += `<p><strong>${labels[i]}:</strong> ${val}</p>`;
        });
        resultsContainer.innerHTML = html + `</div>`;
    }

});