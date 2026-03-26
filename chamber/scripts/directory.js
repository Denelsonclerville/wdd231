const url = "data/members.json";

// 1. SELEKSYON ELEMAN YO
const directoryContainer = document.querySelector("#business-container"); // Pou Directory.html
const spotlightContainer = document.querySelector(".spotlight-container"); // Pou Index.html
const gridBtn = document.querySelector("#gridViewBtn");
const listBtn = document.querySelector("#listViewBtn");

// 2. FONKSYON PRINCIPAL POU FETCH DONE YO
async function getMembers() {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();

            // SI NOU SOU PAJ DIRECTORY: Afiche tout manm yo
            if (directoryContainer) {
                displayBusinesses(data);
            }

            // SI NOU SOU PAJ INDEX: Afiche Spotlight (Gold/Silver)
            if (spotlightContainer) {
                displaySpotlights(data);
            }
        } else {
            console.error("Erè: Fichye JSON lan pa ka chaje.");
        }
    } catch (error) {
        console.error("Pwoblèm koneksyon:", error);
    }
}

// 3. FONKSYON POU PAJ DIRECTORY (Tout Manm)
function displayBusinesses(members) {
    directoryContainer.innerHTML = "";
    members.forEach((member) => {
        const card = document.createElement("section");
        card.classList.add("business-card");
        card.innerHTML = `
            <div class="card-logo">
                <img src="images/${member.image}" alt="Logo of ${member.name}" loading="lazy" width="150" height="100">
            </div>
            <h3>${member.name}</h3>
            <p class="address">${member.address}</p>
            <p class="phone">${member.phone}</p>
            <p class="url"><a href="https://${member.website}" target="_blank" rel="noopener">${member.website}</a></p>
        `;
        directoryContainer.appendChild(card);
    });
}

// 4. FONKSYON POU PAJ INDEX (Spotlight - Nivo 2 & 3)
function displaySpotlights(members) {
    spotlightContainer.innerHTML = "";

    // Filtre manm ki nivo 2 (Silver) oswa 3 (Gold) sèlman
    const eligibleMembers = members.filter((m) => m.membership === 2 || m.membership === 3);

    // Melanje yo owaza (Shuffle)
    const shuffled = eligibleMembers.sort(() => 0.5 - Math.random());

    // Chwazi 3 manm (Ribrik la mande 2-3)
    const selectedMembers = shuffled.slice(0, 3);

    selectedMembers.forEach((member) => {
        const spotCard = document.createElement("div");
        spotCard.classList.add("card", "spotlight-card");

        const levelName = member.membership === 3 ? "Gold" : "Silver";

        spotCard.innerHTML = `
            <h3>${member.name}</h3>
            <img src="images/${member.image}" alt="${member.name}" width="100" loading="lazy">
            <p>${member.phone}</p>
            <p><a href="https://${member.website}" target="_blank">${member.website}</a></p>
            <p><strong>Membership: ${levelName}</strong></p>
            <p><em>${member.otherInfo}</em></p>
        `;
        spotlightContainer.appendChild(spotCard);
    });
}

// 5. BOUTON GRID/LIST (Sèlman si nou sou paj Directory)
if (gridBtn && listBtn) {
    gridBtn.addEventListener("click", () => {
        directoryContainer.classList.add("grid");
        directoryContainer.classList.remove("list");
        gridBtn.classList.add("active");
        listBtn.classList.remove("active");
    });

    listBtn.addEventListener("click", () => {
        directoryContainer.classList.add("list");
        directoryContainer.classList.remove("grid");
        listBtn.classList.add("active");
        gridBtn.classList.remove("active");
    });
}

// 6. LANSE FETCH LA
getMembers();
