/**
 * Delizioso Restaurant Demo - Main Page JavaScript
 * Handles product display, filtering, modals, and animations
 */

// Global variables
let currentCategory = 'all';
let displayedProducts = 6;
let isLoading = false;
let currentProductId = null; // Store current product ID for ordering

// DOM elements
const productsGrid = DOMUtils.$('#productsGrid');
const categoryFilter = DOMUtils.$('.category-filter');
const loadMoreBtn = DOMUtils.$('#loadMoreBtn');
const productModal = DOMUtils.$('#productModal');
const loadingOverlay = DOMUtils.$('#loadingOverlay');

/**
 * Initialize the main page
 */
function initMainPage() {
    // Load initial products
    loadProducts();

    // Set up event listeners
    setupEventListeners();

    // Add loading animation
    showLoading();

    // Hide loading after initial load
    setTimeout(() => {
        hideLoading();
    }, 1000);
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Category filter buttons
    DOMUtils.$$('.filter-btn').forEach(btn => {
        DOMUtils.addEventListener(btn, 'click', handleCategoryFilter);
    });

    // Load more button
    if (loadMoreBtn) {
        DOMUtils.addEventListener(loadMoreBtn, 'click', handleLoadMore);
    }

    // Product modal
    DOMUtils.addEventListener(DOMUtils.$('#modalClose'), 'click', () => ModalUtils.hideModal('productModal'));
    DOMUtils.addEventListener(DOMUtils.$('#modalCloseBtn'), 'click', () => ModalUtils.hideModal('productModal'));
    DOMUtils.addEventListener(DOMUtils.$('#orderBtn'), 'click', handleOrderNow);

    // Close modal on outside click
    DOMUtils.addEventListener(productModal, 'click', (e) => {
        if (e.target === productModal) {
            ModalUtils.hideModal('productModal');
        }
    });

    // Mobile menu toggle
    const mobileMenuToggle = DOMUtils.$('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        DOMUtils.addEventListener(mobileMenuToggle, 'click', toggleMobileMenu);
    }

    // Smooth scrolling for navigation links
    DOMUtils.$$('.nav-link').forEach(link => {
        DOMUtils.addEventListener(link, 'click', handleNavClick);
    });
}

/**
 * Handle category filtering
 */
function handleCategoryFilter(e) {
    const category = e.target.dataset.category;

    if (!category || category === currentCategory) return;

    // Update active button
    DOMUtils.$$('.filter-btn').forEach(btn => {
        DOMUtils.removeClass(btn, 'active');
    });
    DOMUtils.addClass(e.target, 'active');

    // Update current category and reload products
    currentCategory = category;
    displayedProducts = 6;
    loadProducts();

    // Scroll to products section
    const menuSection = DOMUtils.$('#menu');
    if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Load and display products
 */
function loadProducts() {
    const filteredProducts = getProductsByCategory(currentCategory);
    const productsToShow = filteredProducts.slice(0, displayedProducts);

    // Clear current products
    productsGrid.innerHTML = '';

    // Show loading state
    showLoading();

    // Simulate loading delay
    setTimeout(() => {
        // Create product cards
        productsToShow.forEach((product, index) => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);

            // Stagger animation
            setTimeout(() => {
                AnimationUtils.fadeIn(productCard);
            }, index * 100);
        });

        // Update load more button
        updateLoadMoreButton(filteredProducts.length);

        hideLoading();
    }, 300);
}

/**
 * Create product card element
 */
function createProductCard(product) {
    const card = DOMUtils.createElement('div', ['product-card']);
    card.dataset.productId = product.id;

    // Product image
    const imageDiv = DOMUtils.createElement('div', ['product-image']);
    if (product.image) {
        const img = DOMUtils.createElement('img', [], { src: product.image, alt: product.name });
        imageDiv.appendChild(img);
    } else {
        const placeholder = DOMUtils.createElement('div', ['image-placeholder']);
        placeholder.innerHTML = `
            <i class="fas fa-utensils"></i>
            <span>${product.name}</span>
        `;
        imageDiv.appendChild(placeholder);
    }

    // Product info
    const infoDiv = DOMUtils.createElement('div', ['product-info']);

    const headerDiv = DOMUtils.createElement('div', ['product-header']);
    const nameDiv = DOMUtils.createElement('div', ['product-name']);
    nameDiv.textContent = product.name;
    const priceDiv = DOMUtils.createElement('div', ['product-price']);
    priceDiv.textContent = FormUtils.formatCurrency(product.price);
    headerDiv.appendChild(nameDiv);
    headerDiv.appendChild(priceDiv);

    // Rating
    const ratingDiv = DOMUtils.createElement('div', ['product-rating']);
    ratingDiv.innerHTML = `
        <i class="fas fa-star"></i>
        <span>${product.rating}</span>
    `;

    // Description
    const descDiv = DOMUtils.createElement('div', ['product-description']);
    descDiv.textContent = product.description;

    // Meta info
    const metaDiv = DOMUtils.createElement('div', ['product-meta']);
    metaDiv.innerHTML = `
        <span><i class="fas fa-clock"></i> ${product.prepTime}</span>
        <span><i class="fas fa-fire"></i> ${product.calories} cal</span>
    `;

    infoDiv.appendChild(headerDiv);
    infoDiv.appendChild(ratingDiv);
    infoDiv.appendChild(descDiv);
    infoDiv.appendChild(metaDiv);

    // Product actions
    const actionsDiv = DOMUtils.createElement('div', ['product-actions']);
    const viewBtn = DOMUtils.createElement('button', ['btn', 'btn-primary'], { type: 'button' });
    viewBtn.innerHTML = '<i class="fas fa-eye"></i> View Details';
    DOMUtils.addEventListener(viewBtn, 'click', () => showProductModal(product.id));

    actionsDiv.appendChild(viewBtn);

    // Assemble card
    card.appendChild(imageDiv);
    card.appendChild(infoDiv);
    card.appendChild(actionsDiv);

    // Add click handler to entire card
    DOMUtils.addEventListener(card, 'click', (e) => {
        if (!e.target.closest('.btn')) {
            showProductModal(product.id);
        }
    });

    return card;
}

/**
 * Show product modal with details
 */
function showProductModal(productId) {
    const product = getProductById(productId);
    if (!product) return;

    // Store current product ID for ordering
    currentProductId = productId;

    const modalTitle = DOMUtils.$('#modalTitle');
    const modalBody = DOMUtils.$('#modalBody');

    modalTitle.textContent = product.name;

    modalBody.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                ${product.image ?
                    `<img src="${product.image}" alt="${product.name}">` :
                    `<div class="image-placeholder">
                        <i class="fas fa-utensils"></i>
                        <span>${product.name}</span>
                    </div>`
                }
            </div>
            <div class="product-detail-info">
                <div class="product-detail-price">
                    ${FormUtils.formatCurrency(product.price)}
                </div>
                <div class="product-detail-rating">
                    <i class="fas fa-star"></i>
                    <span>${product.rating} (${Math.floor(Math.random() * 50) + 10} reviews)</span>
                </div>
                <div class="product-detail-description">
                    <h4>Description</h4>
                    <p>${product.description}</p>
                </div>
                <div class="product-detail-meta">
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>Prep Time: ${product.prepTime}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-fire"></i>
                        <span>Calories: ${product.calories}</span>
                    </div>
                </div>
                <div class="product-detail-ingredients">
                    <h4>Ingredients</h4>
                    <ul>
                        ${product.ingredients.map(ingredient =>
                            `<li>${ingredient}</li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;

    ModalUtils.showModal('productModal');
}

/**
 * Handle "Order Now" button click
 */
function handleOrderNow() {
    if (currentProductId) {
        // Store selected product in localStorage
        StorageUtils.save('selectedProduct', currentProductId);

        // Redirect to order page
        window.location.href = 'order.html';
    } else {
        NotificationUtils.showError('Please select a product first');
    }
}

/**
 * Handle load more products
 */
function handleLoadMore() {
    if (isLoading) return;

    isLoading = true;
    const loadBtn = loadMoreBtn;

    // Show loading state
    loadBtn.disabled = true;
    loadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

    setTimeout(() => {
        displayedProducts += 6;
        loadProducts();

        loadBtn.disabled = false;
        loadBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Dishes';

        isLoading = false;
    }, 500);
}

/**
 * Update load more button visibility
 */
function updateLoadMoreButton(totalProducts) {
    if (!loadMoreBtn) return;

    if (displayedProducts >= totalProducts) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-flex';
    }
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    const nav = DOMUtils.$('.nav');
    const toggle = DOMUtils.$('.mobile-menu-toggle');

    if (nav.style.display === 'flex') {
        nav.style.display = 'none';
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
    } else {
        nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.top = '100%';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.background = 'rgba(0, 0, 0, 0.9)';
        nav.style.padding = '1rem';
        toggle.innerHTML = '<i class="fas fa-times"></i>';
    }
}

/**
 * Handle navigation link clicks
 */
function handleNavClick(e) {
    e.preventDefault();
    const target = e.target.getAttribute('href');

    if (target.startsWith('#')) {
        const element = DOMUtils.$(target);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        window.location.href = target;
    }

    // Close mobile menu if open
    const nav = DOMUtils.$('.nav');
    if (nav && window.getComputedStyle(nav).display === 'flex' && window.innerWidth <= 768) {
        toggleMobileMenu();
    }
}

/**
 * Show loading overlay
 */
function showLoading() {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        AnimationUtils.fadeIn(loadingOverlay);
    }
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    if (loadingOverlay) {
        AnimationUtils.fadeOut(loadingOverlay);
    }
}

/**
 * Handle page scroll animations
 */
function handleScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                DOMUtils.addClass(entry.target, 'animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    DOMUtils.$$('.product-card, .feature, .contact-item').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Add CSS for scroll animations
 */
function addScrollAnimationStyles() {
    const style = DOMUtils.createElement('style');
    style.textContent = `
        .product-card, .feature, .contact-item {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .product-card.animate-in, .feature.animate-in, .contact-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMainPage();
    handleScrollAnimations();
    addScrollAnimationStyles();

    // Add some interactive enhancements
    addHoverEffects();
});

/**
 * Add hover effects to elements
 */
function addHoverEffects() {
    // Add pulse effect to buttons on hover
    DOMUtils.$$('.btn').forEach(btn => {
        DOMUtils.addEventListener(btn, 'mouseenter', () => {
            btn.style.animation = 'pulse 0.6s ease';
        });

        DOMUtils.addEventListener(btn, 'animationend', () => {
            btn.style.animation = '';
        });
    });

    // Add subtle scale effect to product cards
    DOMUtils.$$('.product-card').forEach(card => {
        DOMUtils.addEventListener(card, 'mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });

        DOMUtils.addEventListener(card, 'mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Export functions for potential use by other scripts
window.MainPage = {
    loadProducts,
    showProductModal,
    handleCategoryFilter
};