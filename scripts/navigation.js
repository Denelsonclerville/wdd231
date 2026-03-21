document.addEventListener("DOMContentLoaded", () => {

  const hamburger = document.getElementById("hamburger");
  const nav = document.querySelector("nav");
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();

    nav.classList.toggle("open");
    if (nav.classList.contains("open")) {
      hamburger.textContent = "✖"; 
      hamburger.setAttribute("aria-expanded", "true");
    } else {
      hamburger.textContent = "☰";
      hamburger.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove("open");
      hamburger.textContent = "☰";
      hamburger.setAttribute("aria-expanded", "false");
    }
  });

  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      hamburger.textContent = "☰";
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  const currentPage = window.location.pathname.split("/").pop();

  document.querySelectorAll("nav a").forEach(link => {
    const href = link.getAttribute("href");

    if (href === currentPage || (href === "index.html" && currentPage === "")) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  const year = document.getElementById("currentyear");
  if (year) year.textContent = new Date().getFullYear();

  const lastMod = document.getElementById("lastModified");
  if (lastMod) lastMod.textContent = document.lastModified;

});