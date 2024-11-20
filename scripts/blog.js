// const BASE_URL = window.location.hostname.includes('github.io') 
//     ? '/new-blog-azy.solutions'
//     : '';
let BASE_URL = '';
    if (window.location.hostname === 'azy.solutions') {
        BASE_URL = '';
    } else if (window.location.hostname === 'fsebbah.github.io') {
        BASE_URL = '/new-blog-azy.solutions';
    } else {
        BASE_URL = '/dev-blog-azy.solutions'; // Exemple pour un environnement local
    }
document.addEventListener('alpine:init', () => {
    Alpine.data('blogData', (initialData = {}) => ({
        articles: [],
        featuredArticle: null,
        visibleCount: 5,
        currentArticleId: initialData.currentArticleId || null,
        init() {
            this.loadArticles();
        },

        async loadArticles() {
            try {
                //const response = await fetch('/new-blog-azy.solutions/assets/json/articles.json');
                const response = await fetch(BASE_URL+ '/assets/json/articles.json');
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                const articlesData  = await response.json();
                this.updateArticles(articlesData );
                // Stocker tous les articles d'abord
                this.allArticles = articlesData;
            } catch (error) {
                console.error("Failed to load articles:", error);
            }
        },

        updateArticles(newArticles) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            console.log('BASE_URL:', BASE_URL);
            console.log('Original articles images:', newArticles.map(a => a.image));
            const processedArticles = newArticles.map(article => ({
                ...article,
                image: BASE_URL+article.image
            }));
            // 1. Trouver l'article du jour pour le featured
            this.featuredArticle = processedArticles.find(article => {
                const articleDate = new Date(article.date);
                return articleDate.toDateString() === today.toDateString();
            });
            console.log('Processed articles images:', processedArticles.map(a => a.image));

            // 2. Séparer les articles restants en "passés" et "futurs"
            const remainingArticles = processedArticles.filter(article => article.id !== this.featuredArticle?.id);
            const pastArticles = [];
            const futureArticles = [];

            remainingArticles.forEach(article => {
                const articleDate = new Date(article.date);
                if (articleDate < today) {
                    pastArticles.push(article);
                } else if (articleDate > today) {
                    futureArticles.push(article);
                }
            });

            // 3. Trier les articles passés (du plus récent au plus ancien)
            pastArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

            // 4. Trier les articles futurs (du plus proche au plus lointain)
            futureArticles.sort((a, b) => new Date(a.date) - new Date(b.date));

            // 5. Combiner les deux listes : d'abord les passés, puis les futurs
            this.articles = [...pastArticles, ...futureArticles];
        },
        getImagePath(imagePath) {
            if (imagePath.startsWith('/')) {
                return imagePath; // Déjà un chemin absolu
            }
            // Remonter d'un niveau depuis /posts/
            return '../' + imagePath;
        },
        getRelatedArticles: () => {
            // S'assurer que nous avons les articles chargés
            if (!this.allArticles  || this.allArticles .length === 0) {
                return [];
            }

            const totalArticles = this.allArticles.length;

            // Si nous avons moins de 2 articles, retourner un tableau vide
            if (totalArticles < 2) {
                return [];
            }

            // Trouver l'article actuel
            const currentArticle = this.allArticles.find(article => article.id === this.currentArticleId);
            if (!currentArticle) {
                return [];
            }
            const currentDate = new Date()
            // Sélectionner jusqu'à 3 articles liés
            let relatedArticles = this.allArticles
                .filter(article => article.id !== this.currentArticleId) // Exclure l'article actuel
                .filter(article => {
                    // Logique pour déterminer si un article est "lié"
                    // Ici, on peut ajouter des critères comme la catégorie, les tags, etc.
                    return article.category === currentArticle.category;
                })
                .filter(article => new Date(article.date) <= currentDate)
                .sort((a, b) => {
                    // Trier par date, les plus récents d'abord
                    return new Date(b.date) - new Date(a.date);
                })
                .slice(0, 3) // Prendre les 3 premiers articles
                .map(article =>({
                    ...article,
                    image: this.getImagePath(article.image)
                }));
            return relatedArticles;
        },
        get relatedArticles(){
            return this.getRelatedArticles(1);
        },
        get visibleArticles() {
            return this.articles.slice(0, this.visibleCount);
        },

        loadMore() {
            this.visibleCount = Math.min(this.visibleCount + 5, this.articles.length);
        },

        isArticleAvailable(articleDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return new Date(articleDate) <= today;
        },

        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('fr-FR', options);
        }
    }));
});