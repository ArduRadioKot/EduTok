class WikiTock {
    constructor() {
        this.articleImage = document.querySelector('.article-image');
        this.articleTitle = document.querySelector('.article-title');
        this.articleExcerpt = document.querySelector('.article-excerpt');
        this.readMoreBtn = document.querySelector('.read-more-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.likeBtn = document.querySelector('.like-btn');
        this.toolbarBtns = document.querySelectorAll('.toolbar-btn');
        this.videoCard = document.querySelector('.video-card');
        this.videoContainer = document.querySelector('.video-container');
        
        this.currentArticle = null;
        this.nextArticle = null;
        this.likedArticles = new Set();
        this.currentPage = 'home';
        this.settings = {
            language: 'en',
            showImages: true,
            autoPlay: true,
            articleSource: 'all' // возможные значения: 'wikipedia', 'habr', 'siteducation', 'all'
        };
        
        // Swipe variables
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.isSwiping = false;
        this.swipeThreshold = 50; // minimum distance for a swipe
        
        this.init();
    }
    
    init() {
        this.loadRandomArticle();
        this.setupEventListeners();
        this.loadSettings();
        this.preloadNextArticle();
    }
    
    setupEventListeners() {
        this.nextBtn.addEventListener('click', () => this.loadRandomArticle());
        this.likeBtn.addEventListener('click', () => this.toggleLike());
        
        // Add event listeners for toolbar buttons
        this.toolbarBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                this.navigateToPage(page);
            });
        });
        
        // Add touch events for swipe functionality
        this.videoCard.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.videoCard.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.videoCard.addEventListener('touchend', () => this.handleTouchEnd());
        
        // Add mouse events for desktop swipe
        this.videoCard.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.videoCard.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.videoCard.addEventListener('mouseup', () => this.handleMouseUp());
        this.videoCard.addEventListener('mouseleave', () => this.handleMouseUp());
    }
    
    handleTouchStart(e) {
        if (this.currentPage !== 'home') return;
        
        this.touchStartY = e.touches[0].clientY;
        this.isSwiping = true;
        this.videoCard.classList.add('swiping');
        
        // Create swipe indicators
        this.createSwipeIndicators();
    }
    
    handleTouchMove(e) {
        if (!this.isSwiping) return;
        
        this.touchEndY = e.touches[0].clientY;
        const diffY = this.touchEndY - this.touchStartY;
        
        // Apply transform based on swipe distance
        if (Math.abs(diffY) > 10) {
            this.videoCard.style.transform = `translateY(${diffY}px)`;
            this.videoCard.style.opacity = 1 - Math.abs(diffY) / 500;
            
            // Show/hide indicators based on swipe direction
            this.updateSwipeIndicators(diffY);
        }
    }
    
    handleTouchEnd() {
        if (!this.isSwiping) return;
        
        this.isSwiping = false;
        this.videoCard.classList.remove('swiping');
        
        const diffY = this.touchEndY - this.touchStartY;
        
        // Determine if swipe was significant enough
        if (Math.abs(diffY) > this.swipeThreshold) {
            if (diffY > 0) {
                // Swipe down - go to previous article
                this.videoCard.classList.add('swipe-down');
                setTimeout(() => {
                    this.loadRandomArticle();
                    this.videoCard.classList.remove('swipe-down');
                    this.videoCard.style.transform = '';
                    this.videoCard.style.opacity = '';
                }, 300);
            } else {
                // Swipe up - go to next article
                this.videoCard.classList.add('swipe-up');
                setTimeout(() => {
                    this.loadRandomArticle();
                    this.videoCard.classList.remove('swipe-up');
                    this.videoCard.style.transform = '';
                    this.videoCard.style.opacity = '';
                }, 300);
            }
        } else {
            // Reset position if swipe wasn't significant
            this.videoCard.style.transform = '';
            this.videoCard.style.opacity = '';
        }
        
        // Remove swipe indicators
        this.removeSwipeIndicators();
    }
    
    handleMouseDown(e) {
        if (this.currentPage !== 'home') return;
        
        this.touchStartY = e.clientY;
        this.isSwiping = true;
        this.videoCard.classList.add('swiping');
        
        // Create swipe indicators
        this.createSwipeIndicators();
    }
    
    handleMouseMove(e) {
        if (!this.isSwiping) return;
        
        this.touchEndY = e.clientY;
        const diffY = this.touchEndY - this.touchStartY;
        
        // Apply transform based on swipe distance
        if (Math.abs(diffY) > 10) {
            this.videoCard.style.transform = `translateY(${diffY}px)`;
            this.videoCard.style.opacity = 1 - Math.abs(diffY) / 500;
            
            // Show/hide indicators based on swipe direction
            this.updateSwipeIndicators(diffY);
        }
    }
    
    handleMouseUp() {
        if (!this.isSwiping) return;
        
        this.isSwiping = false;
        this.videoCard.classList.remove('swiping');
        
        const diffY = this.touchEndY - this.touchStartY;
        
        // Determine if swipe was significant enough
        if (Math.abs(diffY) > this.swipeThreshold) {
            if (diffY > 0) {
                // Swipe down - go to previous article
                this.videoCard.classList.add('swipe-down');
                setTimeout(() => {
                    this.loadRandomArticle();
                    this.videoCard.classList.remove('swipe-down');
                    this.videoCard.style.transform = '';
                    this.videoCard.style.opacity = '';
                }, 300);
            } else {
                // Swipe up - go to next article
                this.videoCard.classList.add('swipe-up');
                setTimeout(() => {
                    this.loadRandomArticle();
                    this.videoCard.classList.remove('swipe-up');
                    this.videoCard.style.transform = '';
                    this.videoCard.style.opacity = '';
                }, 300);
            }
        } else {
            // Reset position if swipe wasn't significant
            this.videoCard.style.transform = '';
            this.videoCard.style.opacity = '';
        }
        
        // Remove swipe indicators
        this.removeSwipeIndicators();
    }
    
    createSwipeIndicators() {
        // Create up indicator
        const upIndicator = document.createElement('div');
        upIndicator.className = 'swipe-indicator up';
        upIndicator.innerHTML = '<i class="fas fa-chevron-up"></i>';
        this.videoContainer.appendChild(upIndicator);
        
        // Create down indicator
        const downIndicator = document.createElement('div');
        downIndicator.className = 'swipe-indicator down';
        downIndicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
        this.videoContainer.appendChild(downIndicator);
    }
    
    updateSwipeIndicators(diffY) {
        const upIndicator = document.querySelector('.swipe-indicator.up');
        const downIndicator = document.querySelector('.swipe-indicator.down');
        
        if (diffY > 0) {
            // Swiping down
            upIndicator.style.opacity = 0;
            downIndicator.style.opacity = Math.min(1, diffY / 200);
        } else {
            // Swiping up
            upIndicator.style.opacity = Math.min(1, Math.abs(diffY) / 200);
            downIndicator.style.opacity = 0;
        }
    }
    
    removeSwipeIndicators() {
        const indicators = document.querySelectorAll('.swipe-indicator');
        indicators.forEach(indicator => indicator.remove());
    }
    
    navigateToPage(page) {
        this.currentPage = page;
        
        // Update active button
        this.toolbarBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === page);
        });
        
        // Handle page content
        switch(page) {
            case 'home':
                this.showHomePage();
                break;
            case 'liked':
                this.showLikedArticles();
                break;
            case 'settings':
                this.showSettings();
                break;
        }
    }
    
    showHomePage() {
        // Remove any existing panels
        const existingPanel = document.querySelector('.liked-articles, .settings-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        // Show the video card
        document.querySelector('.video-card').style.display = 'block';
        this.loadRandomArticle();
    }
    
    showLikedArticles() {
        // Remove any existing panels
        const existingPanel = document.querySelector('.liked-articles, .settings-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        // Hide the video card
        document.querySelector('.video-card').style.display = 'none';
        
        // Create liked articles list
        const likedList = document.createElement('div');
        likedList.className = 'liked-articles';
        likedList.innerHTML = `
            <h2>Liked Articles</h2>
            <div class="liked-articles-list">
                ${Array.from(this.likedArticles).map(title => `
                    <div class="liked-article-item">
                        <h3>${title}</h3>
                        <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(title)}" target="_blank">Read</a>
                    </div>
                `).join('')}
            </div>
        `;
        
        document.querySelector('.video-container').appendChild(likedList);
    }
    
    showSettings() {
        // Remove any existing panels
        const existingPanel = document.querySelector('.liked-articles, .settings-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        // Hide the video card
        document.querySelector('.video-card').style.display = 'none';
        
        // Create settings panel
        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'settings-panel';
        settingsPanel.innerHTML = `
            <h2>Settings</h2>
            <div class="settings-group">
                <label>
                    <span>Language</span>
                    <select id="language-select">
                        <option value="en" ${this.settings.language === 'en' ? 'selected' : ''}>English</option>
                        <option value="ru" ${this.settings.language === 'ru' ? 'selected' : ''}>Russian</option>
                        <option value="es" ${this.settings.language === 'es' ? 'selected' : ''}>Spanish</option>
                    </select>
                </label>
                <label>
                    <span>Show Images</span>
                    <input type="checkbox" ${this.settings.showImages ? 'checked' : ''}>
                </label>
                <label>
                    <span>Auto-play Next Article</span>
                    <input type="checkbox" ${this.settings.autoPlay ? 'checked' : ''}>
                </label>
                <label>
                    <span>Article Source</span>
                    <select id="article-source-select">
                        <option value="wikipedia" ${this.settings.articleSource === 'wikipedia' ? 'selected' : ''}>Wikipedia</option>
                        <option value="habr" ${this.settings.articleSource === 'habr' ? 'selected' : ''}>Habr</option>
                        <option value="siteducation" ${this.settings.articleSource === 'siteducation' ? 'selected' : ''}>SITeducation</option>
                        <option value="all" ${this.settings.articleSource === 'all' ? 'selected' : ''}>All</option>
                    </select>
                </label>
            </div>
        `;
        
        document.querySelector('.video-container').appendChild(settingsPanel);
        
        // Add event listeners for settings
        const languageSelect = settingsPanel.querySelector('#language-select');
        languageSelect.addEventListener('change', (e) => {
            this.settings.language = e.target.value;
            this.saveSettings();
        });
        
        const checkboxes = settingsPanel.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const setting = e.target.previousElementSibling.textContent.toLowerCase().replace(/\s+/g, '');
                this.settings[setting] = e.target.checked;
                this.saveSettings();
            });
        });

        const articleSourceSelect = settingsPanel.querySelector('#article-source-select');
        articleSourceSelect.addEventListener('change', (e) => {
            this.settings.articleSource = e.target.value;
            this.saveSettings();
        });
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('wikitock-settings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
    }
    
    saveSettings() {
        localStorage.setItem('wikitock-settings', JSON.stringify(this.settings));
    }
    
    preloadNextArticle() {
        // Preload the next article for smoother transitions
        this.fetchRandomArticle().then(article => {
            this.nextArticle = article;
        });
    }
    
    async fetchRandomArticle() {
        const source = this.settings.articleSource;
        
        switch (source) {
            case 'wikipedia':
                return await this.fetchRandomWikipediaArticle();
            case 'habr':
                return await this.fetchRandomHabrArticle();
            case 'siteducation':
                return await this.fetchRandomSITArticle();
            case 'all':
                // Случайный выбор источника
                const sources = ['wikipedia', 'habr', 'siteducation'];
                const randomSource = sources[Math.floor(Math.random() * sources.length)];
                switch (randomSource) {
                    case 'wikipedia':
                        return await this.fetchRandomWikipediaArticle();
                    case 'habr':
                        return await this.fetchRandomHabrArticle();
                    case 'siteducation':
                        return await this.fetchRandomSITArticle();
                }
        }
    }
    
    async fetchRandomWikipediaArticle() {
        try {
            // First, get a random article title
            const response = await fetch(`https://${this.settings.language}.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=1&origin=*`);
            const data = await response.json();
            const articleTitle = data.query.random[0].title;
            
            // Then, get the article details including extract and image
            const articleResponse = await fetch(`https://${this.settings.language}.wikipedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(articleTitle)}&prop=extracts|pageimages&exintro=1&explaintext=1&piprop=original&origin=*`);
            const articleData = await articleResponse.json();
            const pageId = Object.keys(articleData.query.pages)[0];
            const article = articleData.query.pages[pageId];
            
            let imageUrl = 'https://dummyimage.com/400x300/000/fff&text=No+Image';
            if (article.original) {
                imageUrl = article.original.source;
                if (article.original.width > 800) {
                    imageUrl = article.original.source.replace(/\/[^\/]+$/, '/800px-' + article.title + article.original.source.substring(article.original.source.lastIndexOf('.')));
                }
            }
            
            return {
                title: article.title,
                extract: article.extract,
                url: `https://${this.settings.language}.wikipedia.org/wiki/${encodeURIComponent(article.title)}`,
                imageUrl: imageUrl
            };
        } catch (error) {
            console.error('Error fetching article:', error);
            return null;
        }
    }
    
    async fetchRandomHabrArticle() {
        try {
            const corsProxy = 'https://api.allorigins.win/raw?url=';
            const url = corsProxy + encodeURIComponent('https://habr.com/ru/articles/');
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`CORS proxy error: ${response.status} ${response.statusText}`);
            }

            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const articles = Array.from(doc.querySelectorAll('.tm-articles-list__item'));

            if (articles.length > 0) {
                const randomArticle = articles[Math.floor(Math.random() * articles.length)];
                const titleElement = randomArticle.querySelector('.tm-article-snippet__title-link span');
                const title = titleElement ? titleElement.textContent : 'No Title';
                const articleLink = randomArticle.querySelector('.tm-article-snippet__title-link');
                const url = articleLink ? 'https://habr.com' + articleLink.getAttribute('href') : null;
                const descriptionElement = randomArticle.querySelector('.tm-article-body p');
                const extract = descriptionElement ? descriptionElement.textContent : 'No Extract';

                return {
                    title: title,
                    extract: extract,
                    url: url,
                    imageUrl: 'https://dummyimage.com/400x300/000/fff&text=No+Image'
                };
            } else {
                console.warn('No articles found on Habr');
                return null;
            }
        } catch (error) {
            console.error('Error fetching Habr article:', error);
            return null;
        }
    }
    
    async fetchRandomSITArticle() {
        try {
            // Получаем список всех статей с главной страницы
            const response = await fetch('https://x200l.github.io/SITeducation/articles.html');
            const text = await response.text();
            
            // Парсим HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            
            // Получаем все статьи
            const articles = Array.from(doc.querySelectorAll('.article-card'));
            
            if (articles.length === 0) {
                throw new Error('No articles found');
            }
            
            // Выбираем случайную статью
            const randomArticle = articles[Math.floor(Math.random() * articles.length)];
            
            // Получаем данные статьи
            const title = randomArticle.querySelector('.article-title').textContent;
            const preview = randomArticle.querySelector('.article-preview').textContent;
            const articleId = randomArticle.getAttribute('data-article-id');
            
            return {
                title: title,
                extract: preview,
                url: `https://x200l.github.io/SITeducation/articles.html?article=${articleId}`,
                imageUrl: 'https://dummyimage.com/400x300/000/fff&text=SITeducation',
                source: 'siteducation'
            };
        } catch (error) {
            console.error('Error fetching SIT article:', error);
            return await this.fetchRandomWikipediaArticle(); // Fallback to Wikipedia if SIT fails
        }
    }
    
    async loadRandomArticle() {
        try {
            // Use preloaded article if available
            if (this.nextArticle) {
                this.currentArticle = this.nextArticle;
                this.nextArticle = null;
                this.updateUI();
                this.preloadNextArticle(); // Preload the next one
            } else {
                // Fetch a new article
                const article = await this.fetchRandomArticle();
                if (article) {
                    this.currentArticle = article;
                    this.updateUI();
                    this.preloadNextArticle(); // Preload the next one
                } else {
                    this.showError();
                }
            }
        } catch (error) {
            console.error('Error loading article:', error);
            this.showError();
        }
    }
    
    updateUI() {
        this.articleTitle.textContent = this.currentArticle.title;
        this.articleExcerpt.textContent = this.currentArticle.extract;

        const img = new Image();
        if (this.settings.articleSource === 'habr') {
            this.videoCard.style.backgroundImage = `url("https://habr.com/img/habr_logo.svg")`;
        } else {
            this.videoCard.style.backgroundImage = `url("https://dummyimage.com/100x75/000/fff&text=Loading")`;
        }
        img.onload = async () => {
            try {
                await img.decode();
                this.videoCard.style.backgroundImage = `url("${this.settings.showImages ? this.currentArticle.imageUrl : 'https://via.placeholder.com/400x300?text=No+Image'}")`;
            } catch (e) {
                console.warn("Failed to decode image, but still displaying it", e);
                this.videoCard.style.backgroundImage = `url("${this.settings.showImages ? this.currentArticle.imageUrl : 'https://via.placeholder.com/400x300?text=No+Image'}")`;
            }
            loadingSpinner.remove();
        };
        img.onerror = () => {
            this.videoCard.style.backgroundImage = `url("https://dummyimage.com/400x300/000/fff&text=Error")`;
            loadingSpinner.remove();
        };
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner';
        this.videoCard.appendChild(loadingSpinner);
        img.src = this.settings.showImages ? this.currentArticle.imageUrl : 'https://via.placeholder.com/400x300?text=No+Image';

        this.readMoreBtn.href = this.currentArticle.url;
        
        // Update like button state
        this.likeBtn.classList.toggle('liked', this.likedArticles.has(this.currentArticle.title));
    }
    
    toggleLike() {
        if (this.currentArticle) {
            if (this.likedArticles.has(this.currentArticle.title)) {
                this.likedArticles.delete(this.currentArticle.title);
            } else {
                this.likedArticles.add(this.currentArticle.title);
            }
            this.updateUI();
        }
    }
    
    showError() {
        this.articleTitle.textContent = 'Error loading article';
        this.articleExcerpt.textContent = 'Please try again later';
        this.articleImage.src = 'https://via.placeholder.com/400x300?text=Error';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new WikiTock();
}); 