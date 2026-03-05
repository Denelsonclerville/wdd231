const hamburger = document.getElementById("hamburger");
const nav = document.querySelector("header nav");
hamburger.setAttribute("aria-expanded", "false");

hamburger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", isOpen);
    hamburger.textContent = isOpen ? "✖" : "☰";
});

nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.textContent = "☰";});
});

function updateCurrentLink() {
    const links = nav.querySelectorAll("a");
    links.forEach(link => {
        if (link.pathname === window.location.pathname) {
            link.setAttribute("aria-current", "page");
            link.classList.add("current");
        }
    });
}
document.addEventListener("DOMContentLoaded", updateCurrentLink);

const currentYear = document.getElementById("currentyear");
if (currentYear) currentYear.textContent = new Date().getFullYear();

const lastModified = document.getElementById("lastModified");
if (lastModified) {
    const modDate = new Date(document.lastModified);
    lastModified.textContent = modDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'});
}