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

// Enhanced Mobile Optimizations with Image Backgrounds
function initMobileOptimizations() {
    const isMobile = window.innerWidth <= 768;
    const isVerySlowDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
    const isSlowConnection = navigator.connection && 
        (navigator.connection.effectiveType === 'slow-2g' || 
         navigator.connection.effectiveType === '2g');
    
    if (isMobile) {
        document.body.classList.add('mobile-optimized');
        
        // Always disable videos on mobile and use images instead
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.style.display = 'none';
            video.pause();
            video.src = '';
        });
        
        // Set fallback image backgrounds
        const hero = document.querySelector('.hero');
        const videoSection = document.querySelector('.video-section');
        
        if (hero) {
            // Try to use existing DGCS background as hero background
            hero.style.background = `
                url('assets/images/DGCS-background.avif') center/cover,
                linear-gradient(135deg, rgba(42, 63, 77, 0.7) 0%, rgba(26, 37, 46, 0.8) 100%)
            `;
            hero.style.backgroundBlendMode = 'overlay';
        }
        
        if (videoSection) {
            // Use our-solutions background for video section
            videoSection.style.background = `
                url('assets/images/our-solutions-background.avif') center/cover,
                linear-gradient(45deg, rgba(186, 165, 116, 0.4) 0%, rgba(212, 194, 154, 0.5) 100%)
            `;
            videoSection.style.backgroundBlendMode = 'overlay';
        }
        
        // Reduce effects only on very slow devices
        if (isVerySlowDevice || isSlowConnection) {
            const style = document.createElement('style');
            style.textContent = `
                .mobile-optimized body::before,
                .mobile-optimized body::after {
                    opacity: 0.2 !important;
                    animation-duration: 60s !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        console.log('Mobile device detected - using image backgrounds');
    }
}

// Simplified Video Optimization (since we're disabling videos on mobile)
function initVideoOptimization() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Completely disable videos on mobile
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.style.display = 'none';
            video.pause();
            video.remove(); // Remove from DOM to save memory
        });
        return;
    }
    
    // Enhanced video loading for desktop only
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        video.setAttribute('preload', 'auto');
        
        // Set video quality based on connection
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                video.style.display = 'none';
                return;
            }
        }
        
        // Enhanced loading with fade-in effect
        video.addEventListener('loadstart', () => {
            video.style.opacity = '0';
        });
        
        video.addEventListener('canplay', () => {
            video.style.opacity = '1';
            video.style.transition = 'opacity 0.5s ease';
        });
        
        // Intersection Observer for performance
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
        
        // Error handling
        video.addEventListener('error', (e) => {
            console.log('Video error:', e);
            video.style.display = 'none';
            const parent = video.parentElement;
            parent.style.background = 'linear-gradient(135deg, var(--color-secondary) 0%, #d4c29a 100%)';
        });
    });
}

// Handle video errors gracefully
function handleVideoError(video) {
    video.style.display = 'none';
    const parent = video.parentElement;
    
    // Add appropriate fallback based on video type
    if (video.classList.contains('hero-video') || parent.classList.contains('hero')) {
        parent.style.background = 'linear-gradient(135deg, var(--color-tertiary) 0%, #1a252e 60%, #2a3f4d 100%)';
    } else {
        parent.style.background = 'linear-gradient(45deg, var(--color-secondary) 0%, #d4c29a 50%, #baa574 100%)';
    }
}

// Fixed Parallax Effect (remove navbar movement)
function initParallaxEffect() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Light parallax on mobile - only hero element
        const hero = document.querySelector('.hero');
        let ticking = false;
        
        function updateMobileParallax() {
            const scrolled = window.pageYOffset;
            const heroRate = scrolled * -0.15;
            
            if (hero && scrolled < window.innerHeight * 1.5) {
                hero.style.transform = `translateY(${heroRate}px)`;
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
    
    // Enhanced parallax for desktop - only hero elements
    const hero = document.querySelector('.hero');
    const heroVideo = document.querySelector('.hero-video');
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroRate = scrolled * -0.25;
        const videoRate = scrolled * -0.15;
        
        if (hero) {
            hero.style.transform = `translateY(${heroRate}px)`;
        }
        
        if (heroVideo) {
            heroVideo.style.transform = `translateY(${videoRate}px)`;
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

// Enhanced Scroll Animations with stagger effect
function initScrollAnimations() {
    const isMobile = window.innerWidth <= 768;
    
    const observerOptions = {
        threshold: isMobile ? 0.05 : 0.1,
        rootMargin: isMobile ? '0px 0px -10px 0px' : '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animations
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    if (!isMobile) {
                        entry.target.style.transform = 'translateY(0)';
                    }
                }, index * 100); // 100ms delay between each element
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.use-case-card, .solution-card, .journey-card, .why-column');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        if (!isMobile) {
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
            el.style.transition = 'opacity 0.4s ease';
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

// Enhanced Carousel with touch support
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    const isMobile = window.innerWidth <= 768;
    
    if (!carousel) return;
    
    if (isMobile) {
        // Add touch support for mobile
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            carousel.style.animationPlayState = 'paused';
        }, { passive: true });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            carousel.style.transform = `translateX(calc(-40% - 1.2rem - ${diff}px))`;
        }, { passive: true });
        
        carousel.addEventListener('touchend', () => {
            isDragging = false;
            carousel.style.animationPlayState = 'running';
            carousel.style.transform = '';
        });
    }
    
    // Pause on hover for all devices
    carousel.addEventListener('mouseenter', () => {
        carousel.style.animationPlayState = 'paused';
    });
    
    carousel.addEventListener('mouseleave', () => {
        carousel.style.animationPlayState = 'running';
    });
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

// Add Loading Animation for Cards
function initLoadingAnimation() {
    const cards = document.querySelectorAll('.use-case-card, .solution-card, .journey-card');
    
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });
    
    // Add CSS for the animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in-up {
            animation: fadeInUp 0.6s ease forwards;
        }
    `;
    document.head.appendChild(style);
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

// Enhanced Page Visibility API
function initPageVisibility() {
    document.addEventListener('visibilitychange', () => {
        const videos = document.querySelectorAll('video');
        
        if (document.hidden) {
            // Pause all videos when tab is hidden
            videos.forEach(video => {
                video.pause();
            });
        } else {
            // Resume videos that are in viewport when tab becomes visible
            videos.forEach(video => {
                const rect = video.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible) {
                    video.play().catch(e => console.log('Resume play failed:', e));
                }
            });
        }
    });
}

// Add Performance Monitoring
function initPerformanceMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function measureFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // If FPS drops below 30 on mobile, disable videos
            if (window.innerWidth <= 768 && fps < 30) {
                console.log(`Low FPS detected (${fps}), disabling videos`);
                const videos = document.querySelectorAll('video');
                videos.forEach(video => {
                    video.style.display = 'none';
                    handleVideoError(video);
                });
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    // Start monitoring after page load
    setTimeout(() => {
        requestAnimationFrame(measureFPS);
    }, 3000);
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileOptimizations(); // Run this first
    initThemeToggle();
    initVideoOptimization(); // Enhanced video support
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
    initPageVisibility(); // Enhanced visibility handling
    initPerformanceMonitoring(); // New performance monitoring
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