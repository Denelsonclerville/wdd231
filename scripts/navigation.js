const hamburger = document.getElementById("hamburger");
const nav = document.querySelector("nav");

// initialize aria state
hamburger.setAttribute("aria-expanded", "false");

hamburger.addEventListener("click", () => {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    const newState = !expanded;
    hamburger.setAttribute("aria-expanded", String(newState));
    nav.classList.toggle("open");
    hamburger.textContent = newState ? "✖" : "☰";
});

function updateCurrentLink() {
    const links = nav.querySelectorAll("a");
    links.forEach(link => {
        if (link.pathname === window.location.pathname) {
            link.setAttribute("aria-current", "page");
        }
    });
}

document.addEventListener("DOMContentLoaded", updateCurrentLink);

document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;