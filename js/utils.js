// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Debounce function - Giảm số lần gọi hàm
 * @param {Function} func - Hàm cần debounce
 * @param {number} wait - Thời gian chờ (ms)
 * @returns {Function}
 */
function debounce(func, wait = 300) {
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
 * Throttle function - Giới hạn số lần gọi hàm trong khoảng thời gian
 * @param {Function} func - Hàm cần throttle
 * @param {number} limit - Giới hạn thời gian (ms)
 * @returns {Function}
 */
function throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Kiểm tra element có trong viewport không
 * @param {HTMLElement} element - Element cần kiểm tra
 * @returns {boolean}
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Scroll mượt đến element
 * @param {string} selector - CSS selector
 * @param {number} offset - Khoảng cách offset (px)
 */
function scrollToElement(selector, offset = 70) {
    const element = document.querySelector(selector);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Lấy vị trí scroll hiện tại
 * @returns {number}
 */
function getScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

/**
 * Kiểm tra device là mobile hay không
 * @returns {boolean}
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Format số thành tiền tệ VND
 * @param {number} amount - Số tiền
 * @returns {string}
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

/**
 * Format ngày tháng
 * @param {Date} date - Đối tượng Date
 * @returns {string}
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

/**
 * Validate email
 * @param {string} email - Địa chỉ email
 * @returns {boolean}
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate số điện thoại Việt Nam
 * @param {string} phone - Số điện thoại
 * @returns {boolean}
 */
function isValidPhone(phone) {
    const re = /^(0|\+84)[0-9]{9,10}$/;
    return re.test(phone.replace(/\s/g, ''));
}

/**
 * Show notification
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Thời gian hiển thị (ms)
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Tạo element notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style cho notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Tự động xóa sau duration
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, duration);
}

/**
 * Local Storage helpers
 */
const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },
    
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Error clearing localStorage:', e);
            return false;
        }
    }
};

/**
 * Loading spinner
 */
const loader = {
    show() {
        const existing = document.getElementById('global-loader');
        if (existing) return;
        
        const loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        loader.innerHTML = `
            <div style="
                width: 50px;
                height: 50px;
                border: 5px solid rgba(255,255,255,0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
        `;
        document.body.appendChild(loader);
    },
    
    hide() {
        const loader = document.getElementById('global-loader');
        if (loader) {
            document.body.removeChild(loader);
        }
    }
};

/**
 * Add CSS animations
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Export các hàm để sử dụng
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle,
        isInViewport,
        scrollToElement,
        getScrollPosition,
        isMobile,
        formatCurrency,
        formatDate,
        isValidEmail,
        isValidPhone,
        showNotification,
        storage,
        loader
    };
}
