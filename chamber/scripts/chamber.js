const membersUrl = "data/members.json";

async function getMembersData() {
    try {
        const response = await fetch(membersUrl);
        if (!response.ok) throw new Error("Pa ka jwenn done yo");
        const members = await response.json();

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
        console.error("Members Error:", error);
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

function displaySpotlights(members, container) {
    const eligible = members.filter((m) => m.membership === 2 || m.membership === 3);
    const shuffled = eligible.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

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

function setupViewButtons(businessContainer) {
    const gridBtn = document.querySelector("#gridViewBtn");
    const listBtn = document.querySelector("#listViewBtn");

    if (gridBtn && listBtn) {
        gridBtn.addEventListener("click", () => {
            businessContainer.classList.add("grid");
            businessContainer.classList.remove("list");
            gridBtn.classList.add("active");
            listBtn.classList.remove("active");
        });

        listBtn.addEventListener("click", () => {
            businessContainer.classList.add("list");
            businessContainer.classList.remove("grid");
            listBtn.classList.add("active");
            gridBtn.classList.remove("active");
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getMembersData();

    const timestampField = document.querySelector("#timestamp");
    if (timestampField) {
        timestampField.value = new Date().toISOString();
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