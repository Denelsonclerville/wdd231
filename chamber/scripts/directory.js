const url = "data/members.json";
const container = document.querySelector("#business-container");
const gridBtn = document.querySelector("#gridViewBtn");
const listBtn = document.querySelector("#listViewBtn");

async function getMembers() {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            displayBusinesses(data);
        } else {
            console.error("Erè: Fichye JSON lan pa ka chaje.");
        }
    } catch (error) {
        console.error("Pwoblèm koneksyon:", error);
    }
}

function displayBusinesses(members) {
    if (!container) return;
    container.innerHTML = "";

    members.forEach((member) => {
        const card = document.createElement("section");
        card.classList.add("business-card");

        card.innerHTML = `
            <div class="card-logo">
                <img src="images/${member.image}" 
                     alt="Logo of ${member.name}" 
                     loading="lazy" 
                     width="150" 
                     height="100">
            </div>
            <h3>${member.name}</h3>
            <p class="address">${member.address}</p>
            <p class="phone">${member.phone}</p>
            <p class="url">
                <a href="${member.website}" target="_blank" rel="noopener">${member.website}</a>
            </p>
        `;
        container.appendChild(card);
    });
}

if (gridBtn && listBtn) {
    gridBtn.addEventListener("click", () => {
        container.classList.add("grid");
        container.classList.remove("list");
        gridBtn.classList.add("active");
        listBtn.classList.remove("active");
    });

    listBtn.addEventListener("click", () => {
        container.classList.add("list");
        container.classList.remove("grid");
        listBtn.classList.add("active");
        gridBtn.classList.remove("active");
    });
}
getMembers();
