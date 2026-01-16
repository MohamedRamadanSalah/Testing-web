/**
 * Delizioso Restaurant Demo - Admin Dashboard JavaScript
 * Handles admin dashboard functionality, stats display, and management
 */

// Global variables
let currentStats = {};
let currentAds = [];

/**
 * Initialize the admin dashboard
 */
function initAdminDashboard() {
    // Load dashboard data
    loadDashboardStats();
    loadAds();
    loadProductsTable();
    loadRecentOrders();

    // Set up event listeners
    setupAdminEventListeners();

    // Add real-time updates simulation
    startRealTimeUpdates();
}

/**
 * Set up admin event listeners
 */
function setupAdminEventListeners() {
    // Add product modal
    const addProductBtn = DOMUtils.$('#addProductBtn');
    if (addProductBtn) {
        DOMUtils.addEventListener(addProductBtn, 'click', () => ModalUtils.showModal('addProductModal'));
    }

    // Add product modal close
    const addProductModalClose = DOMUtils.$('#addProductModalClose');
    if (addProductModalClose) {
        DOMUtils.addEventListener(addProductModalClose, 'click', () => ModalUtils.hideModal('addProductModal'));
    }

    // Add product form submission
    const productForm = DOMUtils.$('#productForm');
    if (productForm) {
        DOMUtils.addEventListener(productForm, 'submit', handleAddProduct);
    }

    // Modal cancel buttons
    const addProductModalCancel = DOMUtils.$('#addProductModalCancel');
    if (addProductModalCancel) {
        DOMUtils.addEventListener(addProductModalCancel, 'click', () => ModalUtils.hideModal('addProductModal'));
    }

    // Manage ads button
    const manageAdsBtn = DOMUtils.$('#manageAdsBtn');
    if (manageAdsBtn) {
        DOMUtils.addEventListener(manageAdsBtn, 'click', handleManageAds);
    }

    // View all orders button
    const viewAllOrdersBtn = DOMUtils.$('#viewAllOrdersBtn');
    if (viewAllOrdersBtn) {
        DOMUtils.addEventListener(viewAllOrdersBtn, 'click', handleViewAllOrders);
    }

    // Close modals on outside click
    DOMUtils.$$('.modal').forEach(modal => {
        DOMUtils.addEventListener(modal, 'click', (e) => {
            if (e.target === modal) {
                const modalId = modal.id;
                ModalUtils.hideModal(modalId);
            }
        });
    });
}

/**
 * Load and display dashboard statistics
 */
function loadDashboardStats() {
    const statsGrid = DOMUtils.$('#statsGrid');
    if (!statsGrid) return;

    statsGrid.innerHTML = '';

    dashboardStats.forEach((stat, index) => {
        const statCard = createStatCard(stat);
        statsGrid.appendChild(statCard);

        // Stagger animation
        setTimeout(() => {
            AnimationUtils.slideIn(statCard, 'up', 400);
        }, index * 100);
    });

    // Store current stats for real-time updates
    currentStats = { ...dashboardStats };
}

/**
 * Create statistics card element
 */
function createStatCard(stat) {
    const card = DOMUtils.createElement('div', ['stat-card']);

    const iconDiv = DOMUtils.createElement('div', ['stat-icon', stat.color]);
    iconDiv.innerHTML = `<i class="${stat.icon}"></i>`;

    const infoDiv = DOMUtils.createElement('div', ['stat-info']);
    infoDiv.innerHTML = `
        <h3>${stat.title}</h3>
        <div class="stat-value">${stat.value}</div>
        <div class="stat-change ${stat.changeType}">${stat.change}</div>
    `;

    card.appendChild(iconDiv);
    card.appendChild(infoDiv);

    return card;
}

/**
 * Load and display advertisements
 */
function loadAds() {
    const adsGrid = DOMUtils.$('#adsGrid');
    if (!adsGrid) return;

    adsGrid.innerHTML = '';

    advertisements.forEach((ad, index) => {
        const adCard = createAdCard(ad);
        adsGrid.appendChild(adCard);

        // Stagger animation
        setTimeout(() => {
            AnimationUtils.fadeIn(adCard);
        }, index * 150);
    });

    currentAds = [...advertisements];
}

/**
 * Create advertisement card element
 */
function createAdCard(ad) {
    const card = DOMUtils.createElement('div', ['ad-card']);

    const imageDiv = DOMUtils.createElement('div', ['ad-image']);
    if (ad.image) {
        const img = DOMUtils.createElement('img', [], { src: ad.image, alt: ad.title });
        imageDiv.appendChild(img);
    } else {
        imageDiv.innerHTML = `
            <i class="fas fa-image"></i>
            <span>Ad Image</span>
        `;
    }

    const contentDiv = DOMUtils.createElement('div', ['ad-content']);
    contentDiv.innerHTML = `
        <div class="ad-title">${ad.title}</div>
        <div class="ad-description">${ad.description}</div>
        <div class="ad-stats">
            <span><i class="fas fa-eye"></i> ${ad.impressions.toLocaleString()}</span>
            <span><i class="fas fa-mouse-pointer"></i> ${ad.clicks.toLocaleString()}</span>
        </div>
    `;

    // Add status indicator
    const statusIndicator = DOMUtils.createElement('div', ['ad-status', ad.active ? 'active' : 'inactive']);
    statusIndicator.textContent = ad.active ? 'Active' : 'Inactive';

    contentDiv.appendChild(statusIndicator);

    card.appendChild(imageDiv);
    card.appendChild(contentDiv);

    return card;
}

/**
 * Load products table
 */
function loadProductsTable() {
    const tableBody = DOMUtils.$('#productsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    // Get first 10 products for admin view
    const adminProducts = products.slice(0, 10);

    adminProducts.forEach(product => {
        const row = createProductTableRow(product);
        tableBody.appendChild(row);
    });
}

/**
 * Create product table row
 */
function createProductTableRow(product) {
    const row = DOMUtils.createElement('tr');

    const status = product.popular ? 'Popular' : 'Active';
    const statusClass = product.popular ? 'popular' : 'active';

    row.innerHTML = `
        <td>
            <div class="product-table-info">
                <div class="product-table-name">${product.name}</div>
                <div class="product-table-category">${categories.find(cat => cat.id === product.category)?.name || product.category}</div>
            </div>
        </td>
        <td>$${product.price.toFixed(2)}</td>
        <td><span class="status-badge ${statusClass}">${status}</span></td>
        <td>
            <div class="table-actions">
                <button class="btn-action edit" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action delete" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;

    // Add event listeners for actions
    const editBtn = row.querySelector('.btn-action.edit');
    const deleteBtn = row.querySelector('.btn-action.delete');

    DOMUtils.addEventListener(editBtn, 'click', () => handleEditProduct(product.id));
    DOMUtils.addEventListener(deleteBtn, 'click', () => handleDeleteProduct(product.id));

    return row;
}

/**
 * Load recent orders
 */
function loadRecentOrders() {
    const ordersList = DOMUtils.$('#ordersList');
    if (!ordersList) return;

    ordersList.innerHTML = '';

    recentOrders.forEach((order, index) => {
        const orderItem = createOrderItem(order);
        ordersList.appendChild(orderItem);

        // Stagger animation
        setTimeout(() => {
            AnimationUtils.slideIn(orderItem, 'left', 300);
        }, index * 100);
    });
}

/**
 * Create order item element
 */
function createOrderItem(order) {
    const item = DOMUtils.createElement('div', ['order-item']);

    const orderInfo = DOMUtils.createElement('div', ['order-info']);
    orderInfo.innerHTML = `
        <h4>Order #${order.id}</h4>
        <div class="order-details">
            <span>${order.customerName}</span>
            <span>${order.items.length} item${order.items.length > 1 ? 's' : ''}</span>
            <span>${FormUtils.formatCurrency(order.total)}</span>
        </div>
    `;

    const orderStatus = DOMUtils.createElement('div', ['order-status', order.status]);
    orderStatus.textContent = order.status.charAt(0).toUpperCase() + order.status.slice(1);

    // Add order type indicator
    const orderType = DOMUtils.createElement('div', ['order-type']);
    orderType.innerHTML = `<i class="fas fa-${getOrderTypeIcon(order.orderType)}"></i> ${order.orderType}`;

    item.appendChild(orderInfo);
    item.appendChild(orderType);
    item.appendChild(orderStatus);

    return item;
}

/**
 * Get icon for order type
 */
function getOrderTypeIcon(orderType) {
    const icons = {
        'dine-in': 'chair',
        'delivery': 'truck',
        'takeout': 'shopping-bag'
    };
    return icons[orderType] || 'utensils';
}

/**
 * Handle add product form submission
 */
function handleAddProduct(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const productData = {
        id: Date.now(), // Simple ID generation
        name: formData.get('name'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price')),
        description: formData.get('description'),
        image: formData.get('image') || null,
        rating: 4.5,
        popular: false,
        ingredients: ['Custom ingredients'],
        calories: 400,
        prepTime: '10 mins'
    };

    // Validate form
    if (!validateProductForm(productData)) {
        return;
    }

    // Add to products array (in real app, this would be an API call)
    products.push(productData);

    // Show success message
    NotificationUtils.showSuccess('Product added successfully!');

    // Close modal and reset form
    ModalUtils.hideModal('addProductModal');
    e.target.reset();

    // Refresh products table
    loadProductsTable();

    // Update stats
    updateStatsAfterProductAdd();
}

/**
 * Validate product form data
 */
function validateProductForm(data) {
    if (!data.name || data.name.trim().length < 2) {
        FormUtils.showError(DOMUtils.$('#productName'), 'Product name must be at least 2 characters');
        return false;
    }

    if (!data.price || data.price <= 0) {
        FormUtils.showError(DOMUtils.$('#productPrice'), 'Price must be greater than 0');
        return false;
    }

    if (!data.description || data.description.trim().length < 10) {
        FormUtils.showError(DOMUtils.$('#productDescription'), 'Description must be at least 10 characters');
        return false;
    }

    return true;
}

/**
 * Handle edit product
 */
function handleEditProduct(productId) {
    const product = getProductById(productId);
    if (!product) return;

    NotificationUtils.showInfo(`Edit functionality for "${product.name}" would open here in a full implementation.`);
}

/**
 * Handle delete product
 */
function handleDeleteProduct(productId) {
    const product = getProductById(productId);
    if (!product) return;

    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
        // Remove from products array
        const index = products.findIndex(p => p.id === productId);
        if (index > -1) {
            products.splice(index, 1);
        }

        // Refresh table
        loadProductsTable();

        // Update stats
        updateStatsAfterProductDelete();

        NotificationUtils.showSuccess('Product deleted successfully!');
    }
}

/**
 * Handle manage ads
 */
function handleManageAds() {
    NotificationUtils.showInfo('Ad management panel would open here in a full implementation.');
}

/**
 * Handle view all orders
 */
function handleViewAllOrders() {
    NotificationUtils.showInfo('Full orders management would open here in a full implementation.');
}

/**
 * Update stats after adding product
 */
function updateStatsAfterProductAdd() {
    // Simulate stats update
    const statsGrid = DOMUtils.$('#statsGrid');
    if (statsGrid) {
        const totalProductsStat = dashboardStats.find(stat => stat.id === 'total_orders');
        if (totalProductsStat) {
            totalProductsStat.value = (parseInt(totalProductsStat.value.replace(',', '')) + 1).toLocaleString();
            loadDashboardStats();
        }
    }
}

/**
 * Update stats after deleting product
 */
function updateStatsAfterProductDelete() {
    // Simulate stats update
    const statsGrid = DOMUtils.$('#statsGrid');
    if (statsGrid) {
        const totalProductsStat = dashboardStats.find(stat => stat.id === 'total_orders');
        if (totalProductsStat) {
            totalProductsStat.value = (parseInt(totalProductsStat.value.replace(',', '')) - 1).toLocaleString();
            loadDashboardStats();
        }
    }
}

/**
 * Simulate real-time updates
 */
function startRealTimeUpdates() {
    // Update stats every 30 seconds
    setInterval(() => {
        simulateStatsUpdate();
    }, 30000);

    // Update orders every 15 seconds
    setInterval(() => {
        simulateOrderUpdate();
    }, 15000);
}

/**
 * Simulate statistics updates
 */
function simulateStatsUpdate() {
    // Randomly update some stats
    const updates = [
        { id: 'total_orders', change: Math.floor(Math.random() * 5) + 1 },
        { id: 'total_revenue', change: Math.floor(Math.random() * 50) + 10 },
        { id: 'active_customers', change: Math.floor(Math.random() * 3) + 1 },
        { id: 'menu_views', change: Math.floor(Math.random() * 20) + 5 }
    ];

    updates.forEach(update => {
        const stat = dashboardStats.find(s => s.id === update.id);
        if (stat) {
            if (stat.id === 'total_revenue') {
                const currentValue = parseFloat(stat.value.replace(/[$,]/g, ''));
                stat.value = FormUtils.formatCurrency(currentValue + update.change);
            } else {
                const currentValue = parseInt(stat.value.replace(/,/g, ''));
                stat.value = (currentValue + update.change).toLocaleString();
            }

            // Update change indicator
            stat.change = `+${update.change}`;
            stat.changeType = 'positive';
        }
    });

    // Refresh display
    loadDashboardStats();
}

/**
 * Simulate order status updates
 */
function simulateOrderUpdate() {
    const ordersList = DOMUtils.$('#ordersList');
    if (!ordersList) return;

    // Randomly update order status
    const orderItems = DOMUtils.$$('.order-item');
    if (orderItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * orderItems.length);
        const orderItem = orderItems[randomIndex];
        const statusElement = orderItem.querySelector('.order-status');

        if (statusElement) {
            const currentStatus = statusElement.className.split(' ')[1];
            let newStatus;

            switch (currentStatus) {
                case 'preparing':
                    newStatus = 'ready';
                    break;
                case 'ready':
                    newStatus = 'completed';
                    break;
                default:
                    newStatus = 'preparing';
            }

            statusElement.className = `order-status ${newStatus}`;
            statusElement.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

            // Add visual feedback
            AnimationUtils.fadeIn(statusElement);
        }
    }
}

/**
 * Add CSS for admin-specific styles
 */
function addAdminStyles() {
    const style = DOMUtils.createElement('style');
    style.textContent = `
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        .status-badge.popular {
            background: #fff3cd;
            color: #856404;
        }
        .status-badge.active {
            background: #d4edda;
            color: #155724;
        }
        .btn-action {
            background: none;
            border: none;
            color: #6c757d;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 4px;
            transition: all 0.3s ease;
        }
        .btn-action:hover {
            background: #f8f9fa;
        }
        .btn-action.edit:hover {
            color: #007bff;
        }
        .btn-action.delete:hover {
            color: #dc3545;
        }
        .product-table-info {
            display: flex;
            flex-direction: column;
        }
        .product-table-name {
            font-weight: 600;
        }
        .product-table-category {
            font-size: 0.9rem;
            color: #6c757d;
        }
        .table-actions {
            display: flex;
            gap: 0.5rem;
        }
        .ad-status {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
            margin-top: 0.5rem;
        }
        .ad-status.active {
            background: #d4edda;
            color: #155724;
        }
        .ad-status.inactive {
            background: #f8d7da;
            color: #721c24;
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAdminDashboard();
    addAdminStyles();
});

// Export functions for potential use by other scripts
window.AdminDashboard = {
    loadDashboardStats,
    loadAds,
    loadProductsTable,
    loadRecentOrders
};