document.addEventListener('alpine:init', () => {
    Alpine.data('blogData', () => ({
        articles: [],
        featuredArticle: null,
        visibleCount: 5,
        init() {
            console.log('Initialisation de blogData...');
            const today = new Date().toISOString().split('T')[0];
            this.featuredArticle = this.articles.find(article => article.date === today) || null;
        },
        updateArticles(newArticles) {
            console.log('Mise à jour des articles...');
        
            // Trier les articles : les plus récents en premier, les anciens en dernier
            this.articles = newArticles.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA - dateB; // Plus récent en premier
            });
        
            const today = new Date().toISOString().split('T')[0];
        
            // Séparer l'article du jour
            this.featuredArticle = this.articles.find(article => article.date === today) || this.articles[0];
        
            // Exclure l'article vedette de la liste des articles
            this.articles = this.articles.filter(article => article !== this.featuredArticle);
        
            console.log('Articles triés et mis à jour :', this.articles);
        },
        get visibleArticles() {
            return this.articles.slice(0, this.visibleCount);
        },
        loadMore() {
            this.visibleCount = Math.min(this.visibleCount + 5, this.articles.length);
        },
        isArticleAvailable(articleDate) {
            const today = new Date();
            const publicationDate = new Date(articleDate);
            return publicationDate <= today;
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('fr-FR', options);
        }
        
    }));
});

(async () => {
    try {
        const response = await fetch('/new-blog-azy.solutions/assets/json/articles.json');
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const articles = await response.json();
        console.log('Articles chargés :', articles);

        // Mettre à jour les articles dans Alpine
        const blogContainer = document.querySelector('[x-data="blogData"]');
        if (blogContainer) {
            const blogData = Alpine.$data(blogContainer); // Récupère l'instance Alpine
            blogData.updateArticles(articles);
        } else {
            console.error('Élément avec x-data="blogData" introuvable.');
        }
    } catch (error) {
        console.error("Impossible de charger les articles :", error);
    }
})();
