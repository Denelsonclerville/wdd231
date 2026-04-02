const membersUrl = "data/members.json";

async function getMembersData() {
    try {
        const response = await fetch(membersUrl);
        const members = await response.json();

        const directoryContainer = document.querySelector("#business-container");
        if (directoryContainer) {
            displayDirectory(members, directoryContainer);
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
                <img src="images/${m.image}" alt="${m.name}" loading="lazy">
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
    const shuffled = eligible.sort(() => 0.5 - Math.random()).slice(0, 3);

    container.innerHTML = "";

    shuffled.forEach((m) => {
        const spotCard = document.createElement("div");
        spotCard.className = "spotlight-card";

        spotCard.innerHTML = `
            <h3>${m.name}</h3>
            <p class="tagline"><em>${m.otherInfo || "Business Tag Line"}</em></p>
            <hr>
            <div class="spot-info-wrapper">
                <img src="images/${m.image}" alt="${m.name}" loading="lazy">
                <div class="spot-details">
                    <p>EMAIL: <strong>${m.name.toLowerCase().replace(/\s/g, "")}@gmail.com</strong></p>
                    <p>PHONE: <strong>${m.phone}</strong></p>
                    <p>URL: <a href="https://${m.website}" target="_blank"><strong>${m.website}</strong></a></p>
                </div>
            </div>
        `;
        container.appendChild(spotCard);
    });
}
const gridBtn = document.querySelector("#gridViewBtn");
const listBtn = document.querySelector("#listViewBtn");
const businessContainer = document.querySelector("#business-container");

if (gridBtn && listBtn && businessContainer) {
    gridBtn.addEventListener("click", () => {
        businessContainer.className = "grid";
        gridBtn.classList.add("active");
        listBtn.classList.remove("active");
    });

    listBtn.addEventListener("click", () => {
        businessContainer.className = "list";
        listBtn.classList.add("active");
        gridBtn.classList.remove("active");
    });
}

getMembersData();