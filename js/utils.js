/**
 * Delizioso Restaurant Demo - Utility Functions
 * Shared utility functions for the entire application
 */

/**
 * DOM manipulation utilities
 */
const DOMUtils = {
    // Create element with classes and attributes
    createElement(tag, classes = [], attributes = {}) {
        const element = document.createElement(tag);
        if (classes.length > 0) {
            element.classList.add(...classes);
        }
        Object.keys(attributes).forEach(attr => {
            element.setAttribute(attr, attributes[attr]);
        });
        return element;
    },

    // Add event listener with optional options
    addEventListener(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
    },

    // Toggle class on element
    toggleClass(element, className) {
        element.classList.toggle(className);
    },

    // Add class to element
    addClass(element, className) {
        element.classList.add(className);
    },

    // Remove class from element
    removeClass(element, className) {
        element.classList.remove(className);
    },

    // Check if element has class
    hasClass(element, className) {
        return element.classList.contains(className);
    },

    // Get element by selector
    $(selector, context = document) {
        return context.querySelector(selector);
    },

    // Get elements by selector
    $$(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    }
};

/**
 * Animation utilities
 */
const AnimationUtils = {
    // Fade in element
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';

        const start = performance.now();

        const fade = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = elapsed / duration;

            if (progress < 1) {
                element.style.opacity = progress;
                requestAnimationFrame(fade);
            } else {
                element.style.opacity = '1';
            }
        };

        requestAnimationFrame(fade);
    },

    // Fade out element
    fadeOut(element, duration = 300) {
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity) || 1;

        const fade = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = elapsed / duration;

            if (progress < 1) {
                element.style.opacity = startOpacity * (1 - progress);
                requestAnimationFrame(fade);
            } else {
                element.style.opacity = '0';
                element.style.display = 'none';
            }
        };

        requestAnimationFrame(fade);
    },

    // Slide in from direction
    slideIn(element, direction = 'up', duration = 400) {
        const directions = {
            up: 'translateY(100%)',
            down: 'translateY(-100%)',
            left: 'translateX(100%)',
            right: 'translateX(-100%)'
        };

        element.style.transform = directions[direction];
        element.style.opacity = '0';
        element.style.display = 'block';

        setTimeout(() => {
            element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
            element.style.transform = 'translate(0, 0)';
            element.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            element.style.transition = '';
        }, duration + 10);
    },

    // Add loading animation to element
    addLoadingSpinner(element) {
        const spinner = DOMUtils.createElement('div', ['loading-spinner']);
        spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        element.appendChild(spinner);
        return spinner;
    },

    // Remove loading animation from element
    removeLoadingSpinner(element) {
        const spinner = element.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }
};

/**
 * Modal utilities
 */
const ModalUtils = {
    // Show modal with animation
    showModal(modalId) {
        const modal = DOMUtils.$(`#${modalId}`);
        if (modal) {
            modal.style.display = 'flex';
            AnimationUtils.fadeIn(modal, 200);

            // Prevent body scroll
            document.body.style.overflow = 'hidden';

            // Focus trap for accessibility
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (firstElement) firstElement.focus();

            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.hideModal(modalId);
                }
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
        }
    },

    // Hide modal with animation
    hideModal(modalId) {
        const modal = DOMUtils.$(`#${modalId}`);
        if (modal) {
            AnimationUtils.fadeOut(modal, 200);

            // Restore body scroll
            document.body.style.overflow = '';

            // Remove focus trap
            modal.removeEventListener('keydown', () => {});
        }
    }
};

/**
 * Form utilities
 */
const FormUtils = {
    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate phone number (basic)
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
    },

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Calculate tax
    calculateTax(amount, taxRate = 0.085) {
        return amount * taxRate;
    },

    // Show form error
    showError(inputElement, message) {
        const formGroup = inputElement.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');

        if (!errorElement) {
            errorElement = DOMUtils.createElement('div', ['error-message']);
            formGroup.appendChild(errorElement);
        }

        errorElement.textContent = message;
        DOMUtils.addClass(formGroup, 'error');
        inputElement.focus();
    },

    // Hide form error
    hideError(inputElement) {
        const formGroup = inputElement.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');

        if (errorElement) {
            errorElement.remove();
        }

        DOMUtils.removeClass(formGroup, 'error');
    },

    // Clear all form errors
    clearAllErrors(formElement) {
        const errorElements = formElement.querySelectorAll('.error-message');
        errorElements.forEach(error => error.remove());

        const errorGroups = formElement.querySelectorAll('.form-group.error');
        errorGroups.forEach(group => DOMUtils.removeClass(group, 'error'));
    }
};

/**
 * Local storage utilities
 */
const StorageUtils = {
    // Save data to localStorage
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    // Load data from localStorage
    load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    },

    // Remove data from localStorage
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    // Clear all localStorage
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

/**
 * Notification utilities
 */
const NotificationUtils = {
    // Show success notification
    showSuccess(message, duration = 3000) {
        this.showNotification(message, 'success', duration);
    },

    // Show error notification
    showError(message, duration = 5000) {
        this.showNotification(message, 'error', duration);
    },

    // Show info notification
    showInfo(message, duration = 3000) {
        this.showNotification(message, 'info', duration);
    },

    // Generic notification
    showNotification(message, type = 'info', duration = 3000) {
        // Remove existing notifications
        const existingNotifications = DOMUtils.$$('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = DOMUtils.createElement('div', ['notification', `notification-${type}`]);
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getIconForType(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => DOMUtils.addClass(notification, 'show'), 10);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => this.hideNotification(notification), duration);
        }

        // Close button event
        const closeBtn = notification.querySelector('.notification-close');
        DOMUtils.addEventListener(closeBtn, 'click', () => this.hideNotification(notification));
    },

    // Hide notification
    hideNotification(notification) {
        DOMUtils.removeClass(notification, 'show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    },

    // Get icon for notification type
    getIconForType(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        return icons[type] || icons.info;
    }
};

/**
 * Date and time utilities
 */
const DateUtils = {
    // Format date for display
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
    },

    // Format time for display
    formatTime(date, options = {}) {
        const defaultOptions = {
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(date).toLocaleTimeString('en-US', { ...defaultOptions, ...options });
    },

    // Get relative time (e.g., "2 hours ago")
    getRelativeTime(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
};

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for performance optimization
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}