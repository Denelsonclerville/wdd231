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
        console.error("Error loading organizations:", err);
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
            <p><strong> Address:</strong> ${org.address}</p>
            <p><strong>📍 Location:</strong> ${org.location}</p>
            <p><strong>📞 Phone:</strong> ${org.phone}</p>
            <p><strong>📅 Founded:</strong> ${org.founded}</p>
        </div>
        <div class="modal-detailed-content">
            <h3>Mission</h3>
            <p>${org.mission}</p>
            
            <h3>Key Programs</h3>
            <p>${org.programs}</p>
            
            <h3>Community Impact</h3>
            <p>${org.impact}</p>
        </div>
        <div class="modal-footer-btn">
            <a href="${org.website}" target="_blank" class="button button-primary">Visit Official Website</a>
        </div>
    `;
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
        const errorBanner = document.createElement("div");
        errorBanner.id = "error-banner";
        errorBanner.style.display = "none";
        contactForm.prepend(errorBanner);

        const fields = ["fname", "lname", "phone", "email", "org-choice", "description"];
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
            const inputs = contactForm.querySelectorAll("input[required], select[required], textarea[required]");
            let firstInvalid = null;
            let hasError = false;

            inputs.forEach(input => {
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
                        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                };
            } else {
                errorBanner.style.display = "none";
                fields.forEach(id => localStorage.removeItem(`contact_${id}`));
            }
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
});