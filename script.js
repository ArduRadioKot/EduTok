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
            autoPlay: true
        };
        
        // Swipe variables
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isSwiping = false;
        this.swipeThreshold = 100; // minimum distance for a swipe
        
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
        
        this.touchStartX = e.touches[0].clientX;
        this.isSwiping = true;
        this.videoCard.classList.add('swiping');
        
        // Create swipe indicators
        this.createSwipeIndicators();
    }
    
    handleTouchMove(e) {
        if (!this.isSwiping) return;
        
        this.touchEndX = e.touches[0].clientX;
        const diffX = this.touchEndX - this.touchStartX;
        
        // Apply transform based on swipe distance
        if (Math.abs(diffX) > 10) {
            this.videoCard.style.transform = `translateX(${diffX}px)`;
            this.videoCard.style.opacity = 1 - Math.abs(diffX) / 500;
            
            // Show/hide indicators based on swipe direction
            this.updateSwipeIndicators(diffX);
        }
    }
    
    handleTouchEnd() {
        if (!this.isSwiping) return;
        
        this.isSwiping = false;
        this.videoCard.classList.remove('swiping');
        
        const diffX = this.touchEndX - this.touchStartX;
        
        // Determine if swipe was significant enough
        if (Math.abs(diffX) > this.swipeThreshold) {
            if (diffX > 0) {
                // Swipe right - go to previous article
                this.videoCard.classList.add('swipe-right');
                setTimeout(() => {
                    this.loadRandomArticle();
                    this.videoCard.classList.remove('swipe-right');
                    this.videoCard.style.transform = '';
                    this.videoCard.style.opacity = '';
                }, 300);
            } else {
                // Swipe left - go to next article
                this.videoCard.classList.add('swipe-left');
                setTimeout(() => {
                    this.loadRandomArticle();
                    this.videoCard.classList.remove('swipe-left');
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
        
        this.touchStartX = e.clientX;
        this.isSwiping = true;
        this.videoCard.classList.add('swiping');
        
        // Create swipe indicators
        this.createSwipeIndicators();
    }
    
    handleMouseMove(e) {
        if (!this.isSwiping) return;
        
        this.touchEndX = e.clientX;
        const diffX = this.touchEndX - this.touchStartX;
        
        // Apply transform based on swipe distance
        if (Math.abs(diffX) > 10) {
            this.videoCard.style.transform = `translateX(${diffX}px)`;
            this.videoCard.style.opacity = 1 - Math.abs(diffX) / 500;
            
            // Show/hide indicators based on swipe direction
            this.updateSwipeIndicators(diffX);
        }
    }
    
    handleMouseUp() {
        if (!this.isSwiping) return;
        
        this.isSwiping = false;
        this.videoCard.classList.remove('swiping');
        
        const diffX = this.touchEndX - this.touchStartX;
        
        // Determine if swipe was significant enough
        if (Math.abs(diffX) > this.swipeThreshold) {
            if (diffX > 0) {
                // Swipe right - go to previous article
                this.videoCard.classList.add('swipe-right');
                setTimeout(() => {
                    this.loadRandomArticle();
                    this.videoCard.classList.remove('swipe-right');
                    this.videoCard.style.transform = '';
                    this.videoCard.style.opacity = '';
                }, 300);
            } else {
                // Swipe left - go to next article
                this.videoCard.classList.add('swipe-left');
                setTimeout(() => {
                    this.loadRandomArticle();
                    this.videoCard.classList.remove('swipe-left');
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
        // Create left indicator
        const leftIndicator = document.createElement('div');
        leftIndicator.className = 'swipe-indicator left';
        leftIndicator.innerHTML = '<i class="fas fa-chevron-left"></i>';
        this.videoContainer.appendChild(leftIndicator);
        
        // Create right indicator
        const rightIndicator = document.createElement('div');
        rightIndicator.className = 'swipe-indicator right';
        rightIndicator.innerHTML = '<i class="fas fa-chevron-right"></i>';
        this.videoContainer.appendChild(rightIndicator);
    }
    
    updateSwipeIndicators(diffX) {
        const leftIndicator = document.querySelector('.swipe-indicator.left');
        const rightIndicator = document.querySelector('.swipe-indicator.right');
        
        if (diffX > 0) {
            // Swiping right
            leftIndicator.style.opacity = Math.min(1, diffX / 200);
            rightIndicator.style.opacity = 0;
        } else {
            // Swiping left
            leftIndicator.style.opacity = 0;
            rightIndicator.style.opacity = Math.min(1, Math.abs(diffX) / 200);
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
            
            return {
                title: article.title,
                extract: article.extract,
                url: `https://${this.settings.language}.wikipedia.org/wiki/${encodeURIComponent(article.title)}`,
                imageUrl: article.original ? article.original.source : 'https://via.placeholder.com/400x300?text=No+Image'
            };
        } catch (error) {
            console.error('Error fetching article:', error);
            return null;
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
            
            if (this.settings.autoPlay) {
                setTimeout(() => this.loadRandomArticle(), 10000); // Auto-play next article after 10 seconds
            }
        } catch (error) {
            console.error('Error loading article:', error);
            this.showError();
        }
    }
    
    updateUI() {
        this.articleTitle.textContent = this.currentArticle.title;
        this.articleExcerpt.textContent = this.currentArticle.extract;
        this.articleImage.src = this.settings.showImages ? this.currentArticle.imageUrl : 'https://via.placeholder.com/400x300?text=No+Image';
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