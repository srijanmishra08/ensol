/* =====================================================
   PLA - POWER LINE ACCESSORIES
   JavaScript Interactions & Animations
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all modules
    initNavigation();
    initCounterAnimation();

    initScrollAnimations();
    initSmoothScroll();
    initFormHandling();
    initParallaxEffects();
});

/* =====================================================
   NAVIGATION
   ===================================================== */

function initNavigation() {
    const nav = document.querySelector('.glass-nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Scroll effect
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Smart Navbar (Hide on down, Show on up)
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling Down
            nav.classList.add('nav-hidden');
        } else {
            // Scrolling Up
            nav.classList.remove('nav-hidden');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('mobile-open');
        });
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinksList = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* =====================================================
   HERO CANVAS - Animated Grid/Structure Lines
   ===================================================== */



/* =====================================================
   COUNTER ANIMATION
   ===================================================== */

function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

/* =====================================================
   PRODUCT TABS
   ===================================================== */



/* =====================================================
   SCROLL ANIMATIONS
   ===================================================== */

function initScrollAnimations() {
    // Elements to animate
    const animatedElements = document.querySelectorAll(
        '.section-header, .value-card, .solution-block, .why-card, ' +
        '.sector-card-new, .contact-card, .about-text, .about-visual, .certification-wrapper'
    );

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add initial state and observe
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index % 4 * 0.1}s, transform 0.6s ease ${index % 4 * 0.1}s`;
        observer.observe(element);
    });

    // Add animate-in styles
    const animateStyle = document.createElement('style');
    animateStyle.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(animateStyle);
}

/* =====================================================
   SMOOTH SCROLL
   ===================================================== */

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navLinks = document.querySelector('.nav-links');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            if (navLinks.classList.contains('mobile-open')) {
                navLinks.classList.remove('mobile-open');
                mobileMenuBtn.classList.remove('active');
            }
        });
    });
}

/* =====================================================
   FORM HANDLING
   ===================================================== */

function initFormHandling() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Simple validation
        if (!data.name || !data.email) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';

            showNotification('Thank you! We\'ll get back to you soon.', 'success');
            form.reset();

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });

    // Input focus effects
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(0, 102, 204, 0.9)'};
        color: white;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(notification);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        opacity: 0.8;
    `;
    closeBtn.addEventListener('click', () => notification.remove());

    // Auto remove
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

/* =====================================================
   PARALLAX EFFECTS
   ===================================================== */

function initParallaxEffects() {
    const shapes = document.querySelectorAll('.organic-shape');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.05;
            shape.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    // Mouse parallax for hero
    const hero = document.querySelector('.hero');
    const hero3d = document.querySelector('.hero-3d-container');

    if (hero && hero3d) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            hero3d.style.transform = `translateY(-50%) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
        });

        hero.addEventListener('mouseleave', () => {
            hero3d.style.transform = 'translateY(-50%)';
        });
    }
}

/* =====================================================
   MOBILE MENU STYLES
   ===================================================== */

const mobileMenuStyle = document.createElement('style');
mobileMenuStyle.textContent = `
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: rgba(10, 22, 40, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 2rem;
            gap: 1rem;
            transform: translateY(-100%);
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .nav-links.mobile-open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
        }
        
        .nav-links a {
            font-size: 1.1rem;
            padding: 0.75rem 0;
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(mobileMenuStyle);

/* =====================================================
   UTILITY FUNCTIONS
   ===================================================== */

// Debounce function
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

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/* =====================================================
   INITIALIZE ON LOAD
   ===================================================== */

window.addEventListener('load', () => {
    // Remove loading state if any
    document.body.classList.add('loaded');

    // Trigger hero animations
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
    }, 100);
});

// Add initial hero animation style
const heroAnimStyle = document.createElement('style');
heroAnimStyle.textContent = `
    .hero-content {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
    }
    
    body.loaded .hero-content {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(heroAnimStyle);
