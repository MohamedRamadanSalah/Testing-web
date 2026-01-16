/**
 * Delizioso Restaurant Demo - Order Page JavaScript
 * Handles order form functionality, validation, and submission
 */

// Global variables
let selectedProduct = null;
let currentOrderType = 'dine-in';
let currentPaymentMethod = 'cash';
let orderTotal = 0;

/**
 * Initialize the order page
 */
function initOrderPage() {
    // Load selected product if any
    loadSelectedProduct();

    // Set up event listeners
    setupOrderEventListeners();

    // Initialize form
    initializeOrderForm();

    // Calculate initial total
    calculateOrderTotal();
}

/**
 * Load selected product from localStorage
 */
function loadSelectedProduct() {
    const productId = StorageUtils.load('selectedProduct');
    if (productId) {
        selectedProduct = getProductById(parseInt(productId));
        if (selectedProduct) {
            displaySelectedProduct();
        } else {
            // Product not found, redirect to menu
            NotificationUtils.showError('Product not found. Redirecting to menu...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    } else {
        // No product selected, redirect to menu
        NotificationUtils.showInfo('Please select a product from the menu first.');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

/**
 * Display selected product information
 */
function displaySelectedProduct() {
    const selectedProductDiv = DOMUtils.$('#selectedProduct');
    if (!selectedProductDiv || !selectedProduct) return;

    const productSummary = selectedProductDiv.querySelector('.product-summary');
    if (!productSummary) return;

    productSummary.innerHTML = `
        <div class="product-summary-image">
            ${selectedProduct.image ?
                `<img src="${selectedProduct.image}" alt="${selectedProduct.name}">` :
                `<div class="image-placeholder">
                    <i class="fas fa-utensils"></i>
                </div>`
            }
        </div>
        <div class="product-summary-details">
            <h4>${selectedProduct.name}</h4>
            <p>${selectedProduct.description}</p>
            <div class="product-summary-price">
                ${FormUtils.formatCurrency(selectedProduct.price)}
            </div>
        </div>
    `;

    // Show the selected product section
    DOMUtils.removeClass(selectedProductDiv, 'hidden');
}

/**
 * Set up order event listeners
 */
function setupOrderEventListeners() {
    // Order type selection
    DOMUtils.$$('.order-type-option').forEach(option => {
        DOMUtils.addEventListener(option, 'click', handleOrderTypeChange);
    });

    // Payment method selection
    DOMUtils.$$('.payment-option').forEach(option => {
        DOMUtils.addEventListener(option, 'click', handlePaymentMethodChange);
    });

    // Form submission
    const orderForm = DOMUtils.$('#orderForm');
    if (orderForm) {
        DOMUtils.addEventListener(orderForm, 'submit', handleOrderSubmit);
    }

    // Real-time validation
    setupFormValidation();

    // Modal close buttons
    const orderSuccessModalClose = DOMUtils.$('#orderSuccessModalClose');
    if (orderSuccessModalClose) {
        DOMUtils.addEventListener(orderSuccessModalClose, 'click', () => ModalUtils.hideModal('orderSuccessModal'));
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
 * Initialize order form based on selected type
 */
function initializeOrderForm() {
    // Set default order type
    updateOrderTypeSections('dine-in');
}

/**
 * Handle order type change
 */
function handleOrderTypeChange(e) {
    const orderType = e.currentTarget.dataset.type;
    if (!orderType) return;

    // Update active state
    DOMUtils.$$('.order-type-option').forEach(option => {
        DOMUtils.removeClass(option, 'active');
    });
    DOMUtils.addClass(e.currentTarget, 'active');

    // Update current order type
    currentOrderType = orderType;

    // Update form sections
    updateOrderTypeSections(orderType);

    // Recalculate total
    calculateOrderTotal();
}

/**
 * Update form sections based on order type
 */
function updateOrderTypeSections(orderType) {
    // Hide all sections first
    DOMUtils.$$('.form-section').forEach(section => {
        DOMUtils.addClass(section, 'hidden');
    });

    // Show relevant sections
    switch (orderType) {
        case 'dine-in':
            DOMUtils.removeClass(DOMUtils.$('#dineInSection'), 'hidden');
            break;
        case 'delivery':
            DOMUtils.removeClass(DOMUtils.$('#deliverySection'), 'hidden');
            break;
        case 'takeout':
            DOMUtils.removeClass(DOMUtils.$('#takeoutSection'), 'hidden');
            break;
    }
}

/**
 * Handle payment method change
 */
function handlePaymentMethodChange(e) {
    const paymentMethod = e.currentTarget.dataset.method;
    if (!paymentMethod) return;

    // Update active state
    DOMUtils.$$('.payment-option').forEach(option => {
        DOMUtils.removeClass(option, 'active');
    });
    DOMUtils.addClass(e.currentTarget, 'active');

    // Update current payment method
    currentPaymentMethod = paymentMethod;

    // Show/hide card details
    const cardDetails = DOMUtils.$('#cardDetails');
    if (paymentMethod === 'card') {
        DOMUtils.removeClass(cardDetails, 'hidden');
        AnimationUtils.slideDown(cardDetails);
    } else {
        DOMUtils.addClass(cardDetails, 'hidden');
    }
}

/**
 * Set up real-time form validation
 */
function setupFormValidation() {
    // Phone number validation
    const phoneInputs = DOMUtils.$$('input[type="tel"]');
    phoneInputs.forEach(input => {
        DOMUtils.addEventListener(input, 'input', (e) => {
            const value = e.target.value;
            const isValid = FormUtils.isValidPhone(value.replace(/[\s\-\(\)]/g, ''));

            if (value && !isValid) {
                FormUtils.showError(e.target, 'Please enter a valid phone number');
            } else {
                FormUtils.hideError(e.target);
            }
        });
    });

    // Email validation (if added later)
    const emailInputs = DOMUtils.$$('input[type="email"]');
    emailInputs.forEach(input => {
        DOMUtils.addEventListener(input, 'input', (e) => {
            const value = e.target.value;
            const isValid = !value || FormUtils.isValidEmail(value);

            if (value && !isValid) {
                FormUtils.showError(e.target, 'Please enter a valid email address');
            } else {
                FormUtils.hideError(e.target);
            }
        });
    });

    // Required field validation on blur
    const requiredInputs = DOMUtils.$$('input[required], select[required], textarea[required]');
    requiredInputs.forEach(input => {
        DOMUtils.addEventListener(input, 'blur', (e) => {
            if (!e.target.value.trim()) {
                FormUtils.showError(e.target, 'This field is required');
            } else {
                FormUtils.hideError(e.target);
            }
        });

        DOMUtils.addEventListener(input, 'input', (e) => {
            if (e.target.value.trim()) {
                FormUtils.hideError(e.target);
            }
        });
    });
}

/**
 * Calculate order total
 */
function calculateOrderTotal() {
    let subtotal = selectedProduct ? selectedProduct.price : 0;
    let tax = FormUtils.calculateTax(subtotal);
    let deliveryFee = 0;

    // Add delivery fee for delivery orders
    if (currentOrderType === 'delivery') {
        deliveryFee = 3.99;
    }

    const total = subtotal + tax + deliveryFee;

    // Update display
    updateOrderSummary(subtotal, tax, deliveryFee, total);

    // Store total
    orderTotal = total;
}

/**
 * Update order summary display
 */
function updateOrderSummary(subtotal, tax, deliveryFee, total) {
    const subtotalEl = DOMUtils.$('#subtotal');
    const taxEl = DOMUtils.$('#tax');
    const deliveryFeeEl = DOMUtils.$('#deliveryFee');
    const totalEl = DOMUtils.$('#total');

    if (subtotalEl) subtotalEl.textContent = FormUtils.formatCurrency(subtotal);
    if (taxEl) taxEl.textContent = FormUtils.formatCurrency(tax);
    if (deliveryFeeEl) deliveryFeeEl.textContent = FormUtils.formatCurrency(deliveryFee);
    if (totalEl) totalEl.textContent = FormUtils.formatCurrency(total);
}

/**
 * Handle order form submission
 */
function handleOrderSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!validateOrderForm()) {
        return;
    }

    // Show loading state
    const submitBtn = DOMUtils.$('#placeOrderBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    // Simulate order processing
    setTimeout(() => {
        // Create order object
        const orderData = createOrderData();

        // Save order (simulate API call)
        saveOrder(orderData);

        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Show success modal
        showOrderSuccess(orderData);

    }, 2000);
}

/**
 * Validate order form
 */
function validateOrderForm() {
    let isValid = true;
    const form = DOMUtils.$('#orderForm');

    // Clear previous errors
    FormUtils.clearAllErrors(form);

    // Validate required fields based on order type
    const requiredFields = getRequiredFieldsForOrderType(currentOrderType);

    requiredFields.forEach(fieldId => {
        const field = DOMUtils.$(`#${fieldId}`);
        if (field && !field.value.trim()) {
            FormUtils.showError(field, 'This field is required');
            isValid = false;
        }
    });

    // Validate payment details if credit card
    if (currentPaymentMethod === 'card') {
        const cardNumber = DOMUtils.$('#cardNumber');
        const expiryDate = DOMUtils.$('#expiryDate');
        const cvv = DOMUtils.$('#cvv');
        const cardName = DOMUtils.$('#cardName');

        if (!cardNumber.value.trim()) {
            FormUtils.showError(cardNumber, 'Card number is required');
            isValid = false;
        }
        if (!expiryDate.value.trim()) {
            FormUtils.showError(expiryDate, 'Expiry date is required');
            isValid = false;
        }
        if (!cvv.value.trim()) {
            FormUtils.showError(cvv, 'CVV is required');
            isValid = false;
        }
        if (!cardName.value.trim()) {
            FormUtils.showError(cardName, 'Name on card is required');
            isValid = false;
        }
    }

    // Validate phone numbers
    const phoneInputs = DOMUtils.$$('input[type="tel"]');
    phoneInputs.forEach(input => {
        if (input.value) {
            const cleanPhone = input.value.replace(/[\s\-\(\)]/g, '');
            if (!FormUtils.isValidPhone(cleanPhone)) {
                FormUtils.showError(input, 'Please enter a valid phone number');
                isValid = false;
            }
        }
    });

    return isValid;
}

/**
 * Get required fields for order type
 */
function getRequiredFieldsForOrderType(orderType) {
    const baseFields = [];

    switch (orderType) {
        case 'dine-in':
            baseFields.push('tableNumber');
            break;
        case 'delivery':
            baseFields.push('firstName', 'lastName', 'phone', 'address');
            break;
        case 'takeout':
            baseFields.push('pickupFirstName', 'pickupLastName', 'pickupPhone', 'pickupTime');
            break;
    }

    return baseFields;
}

/**
 * Create order data object
 */
function createOrderData() {
    const orderData = {
        id: Date.now(),
        productId: selectedProduct ? selectedProduct.id : null,
        orderType: currentOrderType,
        paymentMethod: currentPaymentMethod,
        total: orderTotal,
        status: 'preparing',
        orderTime: new Date().toISOString(),
        items: selectedProduct ? [selectedProduct.name] : []
    };

    // Add order type specific data
    switch (currentOrderType) {
        case 'dine-in':
            orderData.tableNumber = DOMUtils.$('#tableNumber').value;
            orderData.customerName = 'Dine-in Customer';
            break;
        case 'delivery':
            orderData.customerName = `${DOMUtils.$('#firstName').value} ${DOMUtils.$('#lastName').value}`;
            orderData.phone = DOMUtils.$('#phone').value;
            orderData.address = DOMUtils.$('#address').value;
            orderData.locationLink = DOMUtils.$('#locationLink').value;
            orderData.deliveryNotes = DOMUtils.$('#deliveryNotes').value;
            break;
        case 'takeout':
            orderData.customerName = `${DOMUtils.$('#pickupFirstName').value} ${DOMUtils.$('#pickupLastName').value}`;
            orderData.phone = DOMUtils.$('#pickupPhone').value;
            orderData.pickupTime = DOMUtils.$('#pickupTime').value;
            break;
    }

    // Add payment details if credit card
    if (currentPaymentMethod === 'card') {
        orderData.cardDetails = {
            lastFour: DOMUtils.$('#cardNumber').value.slice(-4),
            expiryDate: DOMUtils.$('#expiryDate').value,
            cardName: DOMUtils.$('#cardName').value
        };
    }

    return orderData;
}

/**
 * Save order (simulate API call)
 */
function saveOrder(orderData) {
    // In a real app, this would be an API call
    // For demo, we'll just store in localStorage
    const existingOrders = StorageUtils.load('orders') || [];
    existingOrders.push(orderData);
    StorageUtils.save('orders', existingOrders);

    // Update recent orders in admin dashboard
    recentOrders.unshift({
        id: orderData.id,
        customerName: orderData.customerName,
        items: orderData.items,
        total: orderData.total,
        status: orderData.status,
        orderTime: orderData.orderTime,
        orderType: orderData.orderType
    });

    // Keep only last 10 orders
    if (recentOrders.length > 10) {
        recentOrders.splice(10);
    }
}

/**
 * Show order success modal
 */
function showOrderSuccess(orderData) {
    const modalBody = DOMUtils.$('#orderSuccessModal .modal-body');
    const orderDetails = DOMUtils.$('#orderDetails');

    // Create success message
    let confirmationMessage = '';

    switch (orderData.orderType) {
        case 'dine-in':
            confirmationMessage = `Your order will be served at table ${orderData.tableNumber}. Estimated wait time: 15-20 minutes.`;
            break;
        case 'delivery':
            confirmationMessage = `Your order will be delivered to ${orderData.address}. Your product will arrive within 45 minutes.`;
            break;
        case 'takeout':
            confirmationMessage = `Your order will be ready for pickup in ${orderData.pickupTime === 'asap' ? '15 minutes' : orderData.pickupTime}.`;
            break;
    }

    DOMUtils.$('#orderConfirmationMessage').textContent = confirmationMessage;

    // Create order details
    orderDetails.innerHTML = `
        <div class="order-detail-row">
            <span>Order ID:</span>
            <span>#${orderData.id}</span>
        </div>
        <div class="order-detail-row">
            <span>Order Type:</span>
            <span>${orderData.orderType.charAt(0).toUpperCase() + orderData.orderType.slice(1)}</span>
        </div>
        <div class="order-detail-row">
            <span>Payment Method:</span>
            <span>${paymentMethods.find(pm => pm.id === orderData.paymentMethod)?.name || orderData.paymentMethod}</span>
        </div>
        <div class="order-detail-row">
            <span>Total Amount:</span>
            <span>${FormUtils.formatCurrency(orderData.total)}</span>
        </div>
        ${orderData.tableNumber ? `<div class="order-detail-row"><span>Table Number:</span><span>${orderData.tableNumber}</span></div>` : ''}
        ${orderData.address ? `<div class="order-detail-row"><span>Delivery Address:</span><span>${orderData.address}</span></div>` : ''}
        ${orderData.locationLink ? `<div class="order-detail-row"><span>Location Link:</span><span><a href="${orderData.locationLink}" target="_blank" rel="noopener noreferrer">View Location</a></span></div>` : ''}
    `;

    // Show modal
    ModalUtils.showModal('orderSuccessModal');

    // Clear selected product from storage
    StorageUtils.remove('selectedProduct');

    // Show success notification
    NotificationUtils.showSuccess('Order placed successfully!');
}

/**
 * Add CSS for order page specific styles
 */
function addOrderStyles() {
    const style = DOMUtils.createElement('style');
    style.textContent = `
        .product-summary {
            display: flex;
            gap: 1rem;
            align-items: center;
        }
        .product-summary-image img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
        }
        .product-summary-details h4 {
            margin-bottom: 0.5rem;
        }
        .product-summary-price {
            font-size: 1.25rem;
            font-weight: 600;
            color: #ff6b35;
        }
        .order-detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #f8f9fa;
        }
        .order-detail-row:last-child {
            border-bottom: none;
        }
        .slideDown {
            animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Extend AnimationUtils
AnimationUtils.slideDown = function(element, duration = 300) {
    element.style.display = 'block';
    element.style.animation = `slideDown ${duration}ms ease-out`;
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initOrderPage();
    addOrderStyles();
});

// Export functions for potential use by other scripts
window.OrderPage = {
    calculateOrderTotal,
    validateOrderForm,
    createOrderData
};