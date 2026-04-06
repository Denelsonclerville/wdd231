export function initNavigation(toggleId = 'mobile-menu') {
    const menuButton = document.getElementById(toggleId);
    const nav = document.querySelector('nav');

    function closeMenu() {
        nav.classList.remove('open');
        menuButton?.setAttribute('aria-expanded', 'false');
    }

    if (menuButton) {
        menuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            nav.classList.toggle('open');
            const isOpen = nav.classList.contains('open');
            menuButton.setAttribute('aria-expanded', String(isOpen));
        });
    }

    document.addEventListener('click', (event) => {
        if (!nav.contains(event.target) && event.target !== menuButton) {
            closeMenu();
        }
    });

    document.querySelectorAll('nav a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('nav a').forEach((link) => {
        const href = link.getAttribute('href');
        if (href === currentPage || (href === 'index.html' && currentPage === '')) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}
