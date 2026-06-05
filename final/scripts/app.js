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
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
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
});