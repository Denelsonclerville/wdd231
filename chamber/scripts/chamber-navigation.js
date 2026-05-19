const menuBtn = document.querySelector("#menu");
const navList = document.querySelector(".navigation");

if (menuBtn && navList) {
    menuBtn.addEventListener("click", () => {
        const isVisible = navList.classList.toggle("show");
        menuBtn.classList.toggle("show");
        menuBtn.setAttribute("aria-expanded", String(isVisible));
    });

    document.addEventListener("click", (event) => {
        if (navList.classList.contains("show") && !navList.contains(event.target) && event.target !== menuBtn) {
            navList.classList.remove("show");
            menuBtn.classList.remove("show");
            menuBtn.setAttribute("aria-expanded", "false");
        }
    });

    function setActivePage() {
        const activePage = window.location.pathname;
        const navLinks = document.querySelectorAll(".navigation a");

        navLinks.forEach(link => {
            link.classList.remove("active");
            const linkPath = link.getAttribute("href");
            if ((activePage === "" || activePage === "/" || activePage.includes("index.html")) && 
                (linkPath === "index.html" || linkPath === "/")) {
                link.classList.add("active");
            } 
            else if (linkPath !== "#" && linkPath !== "" && activePage.includes(linkPath)) {
                link.classList.add("active");
            }
        });
    }

    setActivePage();
}

const yearSpan = document.querySelector("#year");
const lastModSpan = document.querySelector("#lastModified");

if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

if (lastModSpan) {
    lastModSpan.textContent = document.lastModified;
}