// responsive menu toggle and wayfinding

const hamburger = document.getElementById("hamburger");
const nav = document.querySelector("nav");

// initialize aria state
hamburger.setAttribute("aria-expanded", "false");

hamburger.addEventListener("click", () => {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
});

// mark current page link for accessibility
function updateCurrentLink() {
    const links = nav.querySelectorAll("a");
    links.forEach(link => {
        // compare pathnames to ignore domain
        if (link.pathname === window.location.pathname) {
            link.setAttribute("aria-current", "page");
        }
    });
}

document.addEventListener("DOMContentLoaded", updateCurrentLink);
