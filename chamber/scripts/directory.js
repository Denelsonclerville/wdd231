const membersUrl = "data/members.json";

async function getMembersData() {
     try {
          const response = await fetch(membersUrl);
          if (!response.ok) throw new Error("Pa ka jwenn done yo");
          const members = await response.json();

          // Kontene pou Anyè (Directory)
          const directoryContainer = document.querySelector("#business-container");
          if (directoryContainer) {
               displayDirectory(members, directoryContainer);
               setupViewButtons(directoryContainer);
          }

          // Kontene pou Spotlight (Sa rubrik la mande)
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

// FONKSYON SPOTLIGHT (Optimize pou Rubrik la)
function displaySpotlights(members, container) {
     // 1. Filtre sèlman manm Silver (2) ak Gold (3)
     const eligible = members.filter((m) => m.membership === 2 || m.membership === 3);

     // 2. Melanje yo owaza (Randomize)
     const shuffled = eligible.sort(() => 0.5 - Math.random());

     // 3. Pran 2 oswa 3 manm sèlman
     const selected = shuffled.slice(0, 3);

     container.innerHTML = ""; // Vide kontene a

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

// Lanse pwosesis la
getMembersData();