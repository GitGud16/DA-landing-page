// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference or default to dark mode
    const currentTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', currentTheme);
    
    // Update theme toggle icon
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Balanced Mobile Performance Detection and Optimizations
function initMobileOptimizations() {
    const isMobile = window.innerWidth <= 768;
    const isVerySlowDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
    const isSlowConnection = navigator.connection && 
        (navigator.connection.effectiveType === 'slow-2g' || 
         navigator.connection.effectiveType === '2g');
    
    if (isMobile || isVerySlowDevice || isSlowConnection) {
        // Add mobile-optimized class
        document.body.classList.add('mobile-optimized');
        
        // Only remove stars on very slow devices/connections
        if (isVerySlowDevice || isSlowConnection) {
            const style = document.createElement('style');
            style.textContent = `
                .mobile-optimized body::before,
                .mobile-optimized body::after {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Keep videos disabled on mobile
        const heroVideo = document.querySelector('.hero-video');
        const sectionVideo = document.querySelector('.section-video');
        
        if (heroVideo) {
            heroVideo.style.display = 'none';
            document.querySelector('.hero').style.background = 
                'linear-gradient(135deg, var(--color-tertiary) 0%, #1a252e 100%)';
        }
        
        if (sectionVideo) {
            sectionVideo.style.display = 'none';
            document.querySelector('.video-section').style.background = 
                'linear-gradient(45deg, var(--color-secondary), #d4c29a)';
        }
    }
}

// Optimized Video Loading for Mobile
function initVideoOptimization() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Disable videos on mobile but keep fallback backgrounds
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.style.display = 'none';
            video.pause();
            video.src = '';
        });
        return;
    }
    
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Set video quality based on connection
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                video.style.display = 'none';
                return;
            }
        }
        
        // Add loading optimization
        video.addEventListener('loadstart', () => {
            video.style.opacity = '0';
        });
        
        video.addEventListener('canplay', () => {
            video.style.opacity = '1';
            video.style.transition = 'opacity 0.5s ease';
        });
        
        // Pause video when not in viewport (performance optimization)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(e => console.log('Video play failed:', e));
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(video);
        
        // Handle video errors gracefully
        video.addEventListener('error', (e) => {
            console.log('Video error:', e);
            video.style.display = 'none';
            // Add fallback background color or image
            const parent = video.parentElement;
            parent.style.background = 'linear-gradient(135deg, var(--color-secondary) 0%, #d4c29a 100%)';
        });
    });
}

// Balanced Parallax Effect (very light on mobile)
function initParallaxEffect() {
    if (window.innerWidth <= 768) {
        // Very subtle parallax on mobile - just for hero section
        const hero = document.querySelector('.hero');
        let ticking = false;
        
        function updateMobileParallax() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.1; // Very minimal movement
            
            if (hero && scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${rate}px)`;
            }
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateMobileParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
        return;
    }
    
    // Full parallax for desktop
    const hero = document.querySelector('.hero');
    const heroVideo = document.querySelector('.hero-video');
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.2;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        if (heroVideo) {
            heroVideo.style.transform = `translateY(${rate * 0.3}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Mobile Navigation Toggle
function initMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (validateForm(data)) {
            // Show success message (in a real application, you would send this to a server)
            showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
        } else {
            showFormMessage('Please fill in all required fields correctly.', 'error');
        }
    });
}

function validateForm(data) {
    const { name, email, company, phone, message } = data;
    
    // Check if all fields are filled
    if (!name || !email || !company || !phone || !message) {
        return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    
    // Basic phone validation (accepts various formats)
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
        return false;
    }
    
    return true;
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Add styles
    messageElement.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 8px;
        font-weight: 500;
        text-align: center;
        ${type === 'success' 
            ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
            : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
        }
    `;
    
    // Insert message after form
    const contactForm = document.getElementById('contactForm');
    contactForm.parentNode.insertBefore(messageElement, contactForm.nextSibling);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// Balanced Scroll Animations (simplified on mobile)
function initScrollAnimations() {
    const isMobile = window.innerWidth <= 768;
    
    const observerOptions = {
        threshold: isMobile ? 0.05 : 0.1, // Lower threshold on mobile for faster trigger
        rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                if (!isMobile) {
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.use-case-card, .solution-card, .journey-card, .why-column');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        if (!isMobile) {
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        } else {
            el.style.transition = 'opacity 0.4s ease'; // Faster on mobile
        }
        observer.observe(el);
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

// Carousel Auto-pause on Hover
function initCarousel() {
    const carousel = document.getElementById('supportCarousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            carousel.style.animationPlayState = 'paused';
        });
        
        carousel.addEventListener('mouseleave', () => {
            carousel.style.animationPlayState = 'running';
        });
    }
}

// Button Click Handlers
function initButtonHandlers() {
    // CTA Button handlers
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', () => {
            // Scroll to contact section
            const contactSection = document.querySelector('.contact-us');
            if (contactSection) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = contactSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Loading Animation
function initLoadingAnimation() {
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Add loading animation styles
        const style = document.createElement('style');
        style.textContent = `
            body:not(.loaded) * {
                animation-play-state: paused !important;
            }
            
            .loaded .hero-content {
                animation: fadeInUp 1s ease forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    });
}

// Responsive Text Sizing
function initResponsiveText() {
    function adjustTextSize() {
        const heroTitle = document.querySelector('.hero-title');
        const windowWidth = window.innerWidth;
        
        if (heroTitle) {
            if (windowWidth < 480) {
                heroTitle.style.fontSize = 'clamp(1.8rem, 8vw, 2.5rem)';
            } else if (windowWidth < 768) {
                heroTitle.style.fontSize = 'clamp(2.5rem, 10vw, 3.5rem)';
            } else {
                heroTitle.style.fontSize = 'clamp(3rem, 6vw, 4rem)';
            }
        }
    }
    
    adjustTextSize();
    window.addEventListener('resize', adjustTextSize);
}

// Enhanced Page Visibility API for Videos
function initPageVisibility() {
    document.addEventListener('visibilitychange', () => {
        const videos = document.querySelectorAll('video');
        const carousel = document.getElementById('supportCarousel');
        
        if (document.hidden) {
            // Pause videos when page is hidden
            videos.forEach(video => video.pause());
            if (carousel) carousel.style.animationPlayState = 'paused';
        } else {
            // Resume videos when page is visible
            videos.forEach(video => {
                const rect = video.getBoundingClientRect();
                const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
                if (isInViewport) {
                    video.play().catch(e => console.log('Video play failed:', e));
                }
            });
            if (carousel) carousel.style.animationPlayState = 'running';
        }
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileOptimizations(); // Run this first
    initThemeToggle();
    initVideoOptimization();
    initMobileNavigation();
    initSmoothScrolling();
    initContactForm();
    initScrollAnimations();
    initNavbarScroll();
    initCarousel();
    initButtonHandlers();
    initParallaxEffect();
    initLoadingAnimation();
    initResponsiveText();
    initPageVisibility();
});

// Optimized resize handler
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
        
        // Re-run mobile optimizations if screen size changed
        const isMobile = window.innerWidth <= 768;
        if (isMobile && !document.body.classList.contains('mobile-optimized')) {
            initMobileOptimizations();
        }
    }, 200); // Reduced from 400ms
}, { passive: true });

// Add resize animation stopper styles
const resizeStyle = document.createElement('style');
resizeStyle.textContent = `
    .resize-animation-stopper * {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
    }
`;
document.head.appendChild(resizeStyle); 