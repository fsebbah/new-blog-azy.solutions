// main.js
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    const sections = document.querySelectorAll('section');
    const sidebar = document.querySelector('.sidebar');
    const BASE_URL = window.location.hostname.includes('github.io') 
    ? '/new-blog-azy.solutions'
    : '';
    // Toggle menu mobile
    // menuToggle.addEventListener('click', () => {
    //     nav.classList.toggle('active');
    // });

    // Gestion du surlignage actif dans la table des matières
    function setActiveLink() {
        let currentSection = '';
        
        // Trouve la section actuellement visible
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 150) {
                currentSection = section.id;
            }
        });

        // Met à jour la classe active sur le lien correspondant
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Gestion du scroll smooth vers les sections
    sidebarLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offset = 80;
                const sectionPosition = targetSection.offsetTop - offset;

                window.scrollTo({
                    top: sectionPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active le surlignage au scroll
    window.addEventListener('scroll', setActiveLink);
    
    // Initialise le surlignage au chargement
    setActiveLink();

    // Ferme le menu quand on clique en dehors
    // document.addEventListener('click', (event) => {
    //     if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
    //         nav.classList.remove('active');
    //     }
    // });
});
