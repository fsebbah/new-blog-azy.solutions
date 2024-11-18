document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const sidebarLinks = document.querySelectorAll('.sidebar a');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const offset = 80;
            const sectionPosition = document.getElementById(targetId).offsetTop - offset;

            window.scrollTo({ top: sectionPosition, behavior: 'smooth' });
        });
    });
});
