const jsonPath = "data/organizations.json";

async function initDirectory() {
    const orgList = document.querySelector("#org-list");
    const countDisplay = document.querySelector("#org-count-display");
    
    if (!orgList) return;

    const modalElement = createModal();

    try {
        const response = await fetch(jsonPath);
        let organizations = await response.json();

        const render = (data, showFounded = false) => {
            if (countDisplay) countDisplay.textContent = `Showing ${data.length} organizations`;
            
            orgList.innerHTML = data.map(org => `
                <div class="organization-card">
                    <div class="card-top">
                        <h3>${org.name}</h3>
                        <p class="category-label">${org.category}</p>
                    </div>
                    <hr class="card-divider">
                    <div class="card-middle">
                        <div class="card-text">
                            <p class="dynamic-info">
                                <strong>${showFounded ? 'Founded: ' + org.founded : 'Phone: ' + org.phone}</strong>
                            </p>
                            <p class="mission-text">${org.description || org.mission.substring(0, 85)}...</p>
                        </div>
                        <div class="card-image-wrapper">
                            <img src="${org.image}" alt="${org.name}" class="small-thumb" loading="lazy">
                        </div>
                    </div>
                    <div class="card-bottom">
                        <button class="details-btn-styled see-more-btn" data-name="${org.name}">See More</button>
                    </div>
                </div>`).join('');

            document.querySelectorAll(".see-more-btn").forEach(btn => {
                btn.onclick = () => {
                    const org = organizations.find(o => o.name === btn.dataset.name);
                    showModal(org, modalElement);
                };
            });
        };

        document.querySelector("#filter-all").onclick = (e) => {
            setActive(e.target);
            render(organizations, false);
        };

        document.querySelector("#filter-new").onclick = (e) => {
            setActive(e.target);
            const sorted = [...organizations].sort((a, b) => b.founded - a.founded);
            render(sorted, true);
        };

        document.querySelector("#filter-old").onclick = (e) => {
            setActive(e.target);
            const sorted = [...organizations].sort((a, b) => a.founded - b.founded);
            render(sorted, true);
        };

        function setActive(btn) {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        }

        render(organizations, false);

    } catch (err) {
        console.error(err);
    }
}

function createModal() {
    let modal = document.querySelector("#org-modal");
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = "org-modal";
    modal.className = "modal hidden";
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div id="modal-body"></div>
        </div>`;
    document.body.appendChild(modal);

    modal.querySelector(".close-modal").onclick = () => modal.classList.add("hidden");
    window.onclick = (event) => { if (event.target == modal) modal.classList.add("hidden"); };
    
    return modal;
}

function showModal(org, modal) {
    const body = modal.querySelector("#modal-body");
    body.innerHTML = `
        <div class="modal-header">
            <img src="${org.image}" alt="${org.name}" style="width: 80px; height: auto; border-radius: 8px;">
            <h2>${org.name}</h2>
        </div>
        <div class="modal-grid-info">
            <p><strong>Category:</strong> ${org.category}</p>
            <p><strong>Founded:</strong> ${org.founded}</p>
            <p><strong>Location:</strong> ${org.location}</p>
            <p><strong>Phone:</strong> ${org.phone}</p>
        </div>
        <hr>
        <p><strong>Mission:</strong> ${org.mission}</p>
        <p><strong>Programs:</strong> ${org.programs}</p>
        <p><strong>Impact:</strong> ${org.impact}</p>
        <div class="modal-footer-btn">
            <a href="${org.website}" target="_blank" class="details-btn-styled">Official Website</a>
        </div>
    `;
    modal.classList.remove("hidden");
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
                wrapper.style.opacity = '0';
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
                            <a href="${org.website}" target="_blank" class="button button-primary slide-visit-btn">Visit Website</a>
                        `;
                        wrapper.appendChild(slide);
                    }
                    wrapper.style.opacity = '1';
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
        const fields = ["fname", "email", "org-choice", "description"];
        const timestamp = document.querySelector("#timestamp");
        
        if (timestamp) timestamp.value = new Date().toISOString();

        fields.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;

            const saved = localStorage.getItem(`contact_${id}`);
            if (saved) el.value = saved;

            el.addEventListener("input", () => {
                localStorage.setItem(`contact_${id}`, el.value);
            });
        });

        contactForm.addEventListener("submit", (e) => {
            const nameField = document.getElementById("fname");
            const namePattern = /^[a-zA-Z\s]{3,}$/;
            
            if (!namePattern.test(nameField.value)) {
                e.preventDefault();
                alert("Please enter a valid name (at least 3 letters).");
                return;
            }
            
            fields.forEach(id => localStorage.removeItem(`contact_${id}`));
        });
    }
}

function setupNavigation() {
    const menuBtn = document.querySelector("#mobile-menu");
    const nav = document.querySelector("nav");
    
    if (menuBtn && nav) {
        menuBtn.onclick = () => {
            nav.classList.toggle("open");
            menuBtn.textContent = nav.classList.contains("open") ? "✕" : "☰";
        };
    }

    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("nav a").forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });
}

function setupFooter() {
    const yearSpan = document.querySelector("#year");
    const lastModSpan = document.querySelector("#lastModified");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    if (lastModSpan) lastModSpan.textContent = document.lastModified;
}

document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupFooter();
    initDirectory();
    initContactPage();
})