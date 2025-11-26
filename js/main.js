// ==========================================
// MAIN JAVASCRIPT FILE
// ==========================================

(function() {
    'use strict';
    
    // ===== MOBILE MENU TOGGLE =====
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // ===== HEADER SCROLL EFFECT =====
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', throttle(function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, 100));
    
    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignore if href is just "#"
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== BACK TO TOP BUTTON =====
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', throttle(function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }, 100));
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===== CONTACT FORM HANDLING =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Validate
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                showMessage('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
                return;
            }
            
            if (!isValidEmail(formData.email)) {
                showMessage('Email không hợp lệ!', 'error');
                return;
            }
            
            if (formData.phone && !isValidPhone(formData.phone)) {
                showMessage('Số điện thoại không hợp lệ!', 'error');
                return;
            }
            
            // Show loading
            loader.show();
            
            // Simulate sending (replace with actual API call)
            setTimeout(() => {
                loader.hide();
                showMessage('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.', 'success');
                contactForm.reset();
                
                // Save to localStorage for reference
                const submissions = storage.get('contact_submissions') || [];
                submissions.push({
                    ...formData,
                    timestamp: new Date().toISOString()
                });
                storage.set('contact_submissions', submissions);
            }, 1500);
        });
    }
    
    function showMessage(message, type) {
        const messageEl = document.getElementById('formMessage');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `form-message ${type}`;
            messageEl.style.display = 'block';
            
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 5000);
        }
    }
    
    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
    
    // ===== SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll('.schedule-card, .news-card, .activity-card, .mission-card, .leader-card, .timeline-item');
    animateElements.forEach(el => observer.observe(el));
    
    // ===== ACTIVE NAV LINK HIGHLIGHTING =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNav() {
        const scrollPos = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    if (sections.length > 0) {
        window.addEventListener('scroll', throttle(highlightNav, 100));
    }
    
    // ===== IMAGE LAZY LOADING =====
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // ===== PRELOAD CRITICAL RESOURCES =====
    function preloadImages() {
        const images = [
            'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920',
            'https://images.unsplash.com/photo-1501389446719-f0ec90876be0?w=600'
        ];
        
        images.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
    
    // ===== PERFORMANCE MONITORING =====
    window.addEventListener('load', function() {
        // Log page load time
        if (window.performance) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page loaded in ${pageLoadTime}ms`);
        }
        
        // Preload images
        preloadImages();
    });
    
    // ===== DETECT EXTERNAL LINKS =====
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        const url = new URL(link.href);
        if (url.hostname !== window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
    
    // ===== SCHEDULE HIGHLIGHT CURRENT DAY =====
    function highlightCurrentDay() {
        const scheduleCards = document.querySelectorAll('.schedule-card');
        const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        scheduleCards.forEach((card, index) => {
            // Simple logic: highlight based on day
            if ((today >= 1 && today <= 5 && index === 0) || // Monday-Friday
                (today === 6 && index === 1) || // Saturday
                (today === 0 && index === 2)) { // Sunday
                card.style.borderLeft = '4px solid var(--accent-color)';
            }
        });
    }
    
    highlightCurrentDay();
    
    // ===== PRINT FRIENDLY =====
    window.addEventListener('beforeprint', function() {
        // Expand all FAQ items before printing
        faqItems.forEach(item => {
            item.classList.add('active');
        });
    });
    
    window.addEventListener('afterprint', function() {
        // Collapse FAQ items after printing
        faqItems.forEach(item => {
            item.classList.remove('active');
        });
    });
    
    // ===== CONSOLE MESSAGE =====
    console.log('%c🙏 Giáo Xứ Bà Trà', 'font-size: 24px; font-weight: bold; color: #1a73e8;');
    console.log('%cWebsite được xây dựng với ❤️ và đức tin', 'font-size: 14px; color: #5f6368;');
    console.log('%c📧 Liên hệ: giaoxubatra@gmail.com', 'font-size: 12px; color: #5f6368;');
    
})();

// ===== GOOGLE ANALYTICS (Thêm tracking ID của bạn) =====
/*
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'YOUR-GA-ID');
*/
