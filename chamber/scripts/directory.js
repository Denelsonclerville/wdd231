
const businesses = [
    { 
        name: "Tech Ayiti", 
        src: "images/img1.svg", 
        email: "info@tech.ht", 
        phone: "(509) 3456-7890", 
        url: "www.techayiti.ht",
        level: "Gold"
    },
    { 
        name: "Lakay Biznis", 
        src: "images/img2.png", 
        email: "contact@lakay.ht", 
        phone: "(509) 3333-2222", 
        url: "www.lakaybiznis.ht",
        level: "Silver"
    },
    { 
        name: "MK Biznis", 
        src: "images/img3.webp", 
        email: "mk@biznis.ht", 
        phone: "(509) 3788-9000", 
        url: "www.mkbiznis.com",
        level: "Gold"
    },
    { 
        name: "Ayiti Food", 
        src: "images/img4.svg", 
        email: "order@ayitifood.ht", 
        phone: "(509) 3677-1111", 
        url: "www.ayitifood.ht",
        level: "Bronze"
    },
    { 
        name: "Bank Nasyonal", 
        src: "images/img5.svg", 
        email: "service@bn.ht", 
        phone: "(509) 3000-2222", 
        url: "www.bn.ht",
        level: "Silver"
    },
    { 
        name: "Bati Kay", 
        src: "images/img6.svg", 
        email: "admin@batikay.ht", 
        phone: "(509) 3333-4444", 
        url: "www.batikay.ht",
        level: "Gold"
    },
    { 
        name: "Digital Solutions", 
        src: "images/img7.svg", 
        email: "hello@digitalsol.ht", 
        phone: "(509) 3555-8888", 
        url: "www.digitalsol.ht",
        level: "Bronze"
    },
    { 
        name: "Transpò Peyi", 
        src: "images/img8.svg", 
        email: "info@transpo.ht", 
        phone: "(509) 3666-9999", 
        url: "www.transpopeyi.ht",
        level: "Silver"
    },
    { 
        name: "Ayiti Tourism", 
        src: "images/img9.webp", 
        email: "visit@tourism.ht", 
        phone: "(509) 3777-0000", 
        url: "www.ayititourism.ht",
        level: "Gold"
    }
];

const container = document.querySelector("#business-container");
function displayBusinesses(data) {
    if (!container) return;
    container.innerHTML = ""; 
    
    data.forEach(bus => {
        const card = document.createElement("section");
        card.classList.add("card");

        card.innerHTML = `
            <h3>${bus.name}</h3>
            <div class="card-content">
                <div class="card-image">
                    <img src="${bus.src}" alt="Logo of ${bus.name}" loading="lazy">
                </div>
                <div class="card-details">
                    <p><strong>Email:</strong> ${bus.email}</p>
                    <p><strong>Phone:</strong> ${bus.phone}</p>
                    <p><strong>URL:</strong> <a href="https://${bus.url}" target="_blank">${bus.url}</a></p>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function displayThreeRandom(data) {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    
    const selected = shuffled.slice(0, 3);
    
    displayBusinesses(selected);
}

displayThreeRandom(businesses);