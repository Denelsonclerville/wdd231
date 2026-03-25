const businesses = [
    { 
        name: "Tech Ayiti", 
        src: "images/img1.svg", 
        address: "Rue Faubert, Pétion-Ville",
        email: "info@tech.ht", 
        phone: "(509) 3456-7890", 
        url: "www.techayiti.ht",
        level: "Gold"
    },
    { 
        name: "Lakay Biznis", 
        src: "images/img2.png", 
        address: "Rue Panamericaine, Pétion-Ville", 
        email: "contact@lakay.ht", 
        phone: "(509) 3333-2222", 
        url: "www.lakaybiznis.ht",
        level: "Silver"
    },
    { 
        name: "MK Biznis", 
        src: "images/img3.webp", 
        address: "Rue Metellus, Pétion-Ville", 
        email: "mk@biznis.ht", 
        phone: "(509) 3788-9000", 
        url: "www.mkbiznis.com",
        level: "Gold"
    },
    { 
        name: "Ayiti Food", 
        src: "images/img4.svg", 
        address: "Place Boyer, Pétion-Ville", 
        email: "order@ayitifood.ht", 
        phone: "(509) 3677-1111", 
        url: "www.ayitifood.ht",
        level: "Bronze"
    },
    { 
        name: "Bank Nasyonal", 
        src: "images/img5.svg", 
        address: "Rue Geffrard, Pétion-Ville", 
        email: "service@bn.ht", 
        phone: "(509) 3000-2222", 
        url: "www.bn.ht",
        level: "Silver"
    },
    { 
        name: "Bati Kay", 
        src: "images/img6.svg", 
        address: "Rue Villate, Pétion-Ville", 
        email: "admin@batikay.ht", 
        phone: "(509) 3333-4444", 
        url: "www.batikay.ht",
        level: "Gold"
    },
    { 
        name: "Resto Lounge", 
        src: "images/img7.svg", 
        address: "Rue Grégoire, Pétion-Ville", 
        email: "contact@haitieconomie.ht", 
        phone: "(509) 3111-2222", 
        url: "www.haitieconomie.ht",
        level: "Gold"
    },
    { 
        name: "Belmart", 
        src: "images/img8.svg", 
        address: "Rue Moïse, Pétion-Ville", 
        email: "sales@pvmarket.ht", 
        phone: "(509) 3222-3333", 
        url: "www.pvmarket.ht",
        level: "Silver"
    },
    { 
        name: "Zansèt Galeri", 
        src: "images/img9.webp", 
        address: "Rue Rigaud, Pétion-Ville", 
        email: "art@zanset.ht", 
        phone: "(509) 3444-5555", 
        url: "www.zansetgaleri.com",
        level: "Bronze"
    }
];

const container = document.querySelector("#business-container");
const gridBtn = document.querySelector("#gridViewBtn");
const listBtn = document.querySelector("#listViewBtn");

function displayBusinesses(data) {
    if (!container) return;
    container.innerHTML = ""; 
    
    data.forEach(bus => {
        const card = document.createElement("section");
        card.classList.add("business-card");

        card.innerHTML = `
            <div class="card-logo">
                <img src="${bus.src}" alt="Logo ${bus.name}" loading="lazy">
            </div>
            <h3>${bus.name}</h3>
            <p class="address">${bus.address}</p>
            <p class="phone">${bus.phone}</p>
            <p class="url"><a href="https://${bus.url}" target="_blank">${bus.url}</a></p>
        `;
        container.appendChild(card);
    });
}

function displayThreeRandom(data) {
    const filtered = data.filter(b => b.level === "Gold" || b.level === "Silver");
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    displayBusinesses(selected);
}

if (gridBtn && listBtn) {
    gridBtn.addEventListener("click", () => {
        container.className = "grid"; 
        gridBtn.classList.add("active");
        listBtn.classList.remove("active");
    });

    listBtn.addEventListener("click", () => {
        container.className = "list"; 
        listBtn.classList.add("active");
        gridBtn.classList.remove("active");
    });
}

if (gridBtn) {
    displayBusinesses(businesses); 
} else {
    displayThreeRandom(businesses);
}