document.addEventListener('DOMContentLoaded', (event) => {
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    const sections = document.querySelectorAll('section');
    const sidebar = document.querySelector('.sidebar');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    function setActiveLink() {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 150) {
                currentSection = section.id;
            }
        });

        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);
    setActiveLink();

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
            nav.classList.remove('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const popupThanks = document.getElementById('thankYouMessage');
    const closePopupThanksBtn = document.getElementById('closePopupTks');
    const form = document.getElementById('sib-form');
    const thankYouModal = document.getElementById('thankYouMessage');

    closePopupThanksBtn.addEventListener('click', () => {
        thankYouModal.style.display = "none";
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            })
                .then(() => {
                    thankYouModal.style.display = "block";
                    form.reset();
                })
                .catch(error => {
                    console.error('Error:', error);
                    displayError('Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer.');
                });
        }
    });

    function validateForm() {
        let isValid = true;
        const email = form.querySelector('#EMAIL');
        const optIn = form.querySelector('#OPT_IN');

        // Réinitialiser les messages d'erreur
        clearErrors();

        // Valider l'email
        if (!email.value.trim()) {
            displayError('Veuillez entrer votre adresse email.', email);
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            displayError('Veuillez entrer une adresse email valide.', email);
            isValid = false;
        }

        // Valider l'opt-in
        if (!optIn.checked) {
            displayError('Veuillez accepter de recevoir nos emails.', optIn);
            isValid = false;
        }

        return isValid;
    }

    function isValidEmail(email) {
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return re.test(email);
    }

    function displayError(message, element) {

    }

    function clearErrors() {
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.remove());
        form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
    }
});

document.addEventListener('alpine:init', () => {
    Alpine.data('blogData', () => ({
        currentArticleIndex: 0,
        featuredArticle: {
            title: "De Turing à ChatGPT : L’évolution fascinante de l’intelligence artificielle",
            description: "Vous ne l’avez peut-être pas remarqué, mais l’intelligence artificielle s’est infiltrée partout dans notre quotidien. Elle suggère vos prochaines séries sur Netflix, pilote les voitures autonomes, détecte les fraudes bancaires et aide même les médecins à diagnostiquer des maladies.",
            image: "assets/img/Frame1.png",
            category: "Intelligence Artificielle",
            date: "2024-11-05",
            readTime: 8,
            url: "posts/de-turing-a-chatgpt.html"
        },
        articles: [
            {
                id: 2,
                title: "Comprendre l’IA de A à Z : les notions clés de l’intelligence artificielle expliquées.",
                description: "Vous entendez parler d'IA tous les jours, mais savez-vous vraiment comment elle fonctionne ? Des assistants vocaux aux voitures autonomes, en passant par la détection de fraudes bancaires... L'IA est partout !",
                image: "assets/img/Frame1.png",
                category: "Cloud",
                date: "2024-11-07",
                readTime: 6,
                url: "posts/post-example.html"
            },
            {
                id: 3,
                title: "Sécurité web : protégez votre application",
                description: "Apprenez à sécuriser efficacement votre site web contre les cyberattaques avec ces techniques éprouvées par les experts.",
                image: "assets/img/Frame1.png",
                category: "Sécurité",
                date: "2024-11-08",
                readTime: 7,
                url: "posts/post-example.html"
            },
            {
                id: 4,
                title: "L'essor du développement mobile en 2024",
                description: "Découvrez les technologies émergentes et les stratégies gagnantes pour créer des applications mobiles performantes.",
                image: "assets/img/Frame1.png",
                category: "Mobile",
                date: "2024-11-09",
                readTime: 4,
                url: "posts/post-example.html"
            },
            {
                id: 5,
                title: "Homme vs Machine : l’IA peut-elle vraiment surpasser l’intelligence humaine ?",
                description: "Avec des avancées impressionnantes comme la victoire d’AlphaGo contre le champion Lee Sedol en 2016, l’intelligence artificielle semble franchir des barrières autrefois réservées à l’intuition et à la créativité humaines. .",
                image: "../assets/img/article_5.jpg",
                category: "Data Science",
                date: "2024-10-27",
                readTime: 9,
                url: "posts/post-example.html"
            },
            {
                id: 6,
                title: "L'art de l'UX Writing",
                description: "Apprenez à rédiger des textes d'interface efficaces qui améliorent l'expérience utilisateur et augmentent les conversions.",
                image: "assets/img/Frame1.png",
                category: "Design",
                date: "2024-10-26",
                readTime: 5,
                url: "posts/post-example.html"
            },
        ],
        visibleCount: 4,
        get visibleArticles() {
            return this.articles.slice(0, this.visibleCount);
        },
        loadMore() {
            this.visibleCount = Math.min(this.visibleCount + 4, this.articles.length);
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('fr-FR', options);
        },
        relatedArticles(currentIndex) {
            const totalArticles = this.articles.length;
            if (totalArticles <= 1) {
                return [];
            }

            let relatedIndices = [];
            const nextIndex = (currentIndex + 1) % totalArticles;
            const prevIndex = (currentIndex - 1 + totalArticles) % totalArticles;

            if (totalArticles === 2) {
                relatedIndices.push(currentIndex === 0 ? 1 : 0);
            } else if (totalArticles === 3) {
                relatedIndices = [0, 1, 2].filter(i => i !== currentIndex);
            } else {
                relatedIndices.push(nextIndex);
                if (prevIndex !== nextIndex) {
                    relatedIndices.push(prevIndex);
                }
            }

            return relatedIndices.map(index => this.articles[index]);
        }
    }))
});