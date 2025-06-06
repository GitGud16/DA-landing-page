// Career Page JavaScript

// Career Image Carousel
class CareerCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.career-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.getElementById('prevSlide');
        this.nextBtn = document.getElementById('nextSlide');
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        // Set up event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Set up indicator clicks
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Auto-play functionality
        this.startAutoPlay();
        
        // Pause auto-play on hover
        const carouselContainer = document.querySelector('.career-carousel-container');
        carouselContainer.addEventListener('mouseenter', () => this.pauseAutoPlay());
        carouselContainer.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Touch support for mobile
        this.initTouchSupport();
        
        console.log('Career carousel initialized with', this.slides.length, 'slides');
    }
    
    goToSlide(index) {
        // Remove active class from current slide and indicator
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].classList.remove('active');
        
        // Update current slide
        this.currentSlide = index;
        
        // Add active class to new slide and indicator
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    startAutoPlay() {
        this.pauseAutoPlay(); // Clear any existing interval
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    initTouchSupport() {
        const carousel = document.querySelector('.career-carousel');
        let startX = 0;
        let endX = 0;
        let threshold = 50;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        }, { passive: true });
    }
}

// Career Form Handling
class CareerFormHandler {
    constructor() {
        this.form = document.getElementById('joinUsForm');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add real-time validation
        this.addRealTimeValidation();
        
        console.log('Career form handler initialized');
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        if (this.validateForm(data)) {
            this.showSuccess();
            this.form.reset();
        } else {
            this.showError('Please fill in all required fields correctly.');
        }
    }
    
    validateForm(data) {
        const { firstName, lastName, phone, email, positionType } = data;
        
        // Check required fields
        if (!firstName || !lastName || !phone || !email || !positionType) {
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return false;
        }
        
        // Phone validation
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phone)) {
            return false;
        }
        
        return true;
    }
    
    addRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        } else if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid phone number';
            }
        }
        
        this.setFieldValidation(field, isValid, message);
    }
    
    setFieldValidation(field, isValid, message) {
        const formGroup = field.closest('.form-group');
        
        // Remove existing validation classes and messages
        formGroup.classList.remove('field-error', 'field-success');
        const existingError = formGroup.querySelector('.field-error-message');
        if (existingError) {
            existingError.remove();
        }
        
        if (!isValid) {
            formGroup.classList.add('field-error');
            const errorElement = document.createElement('span');
            errorElement.className = 'field-error-message';
            errorElement.textContent = message;
            formGroup.appendChild(errorElement);
        } else if (field.value.trim()) {
            formGroup.classList.add('field-success');
        }
    }
    
    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('field-error');
        const errorMessage = formGroup.querySelector('.field-error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    showSuccess() {
        this.showMessage('Thank you for your application! We will review it and get back to you soon.', 'success');
    }
    
    showError(message) {
        this.showMessage(message, 'error');
    }
    
    showMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Style the message
        messageElement.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 10px;
            font-weight: 500;
            animation: slideInDown 0.3s ease;
            ${type === 'success' 
                ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
                : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
            }
        `;
        
        // Insert message after form
        this.form.parentNode.insertBefore(messageElement, this.form.nextSibling);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.animation = 'slideOutUp 0.3s ease';
                setTimeout(() => messageElement.remove(), 300);
            }
        }, 5000);
    }
}

// Scroll to form when "Join Us" button is clicked
function initCareerButtonHandlers() {
    const careerCTAButton = document.querySelector('.career-cta-button');
    
    if (careerCTAButton) {
        careerCTAButton.addEventListener('click', () => {
            const joinUsSection = document.querySelector('.join-us-form-section');
            if (joinUsSection) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = joinUsSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Enhanced scroll animations for career page
function initCareerScrollAnimations() {
    const isMobile = window.innerWidth <= 768;
    
    const observerOptions = {
        threshold: isMobile ? 0.05 : 0.1,
        rootMargin: isMobile ? '0px 0px -10px 0px' : '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    if (!isMobile) {
                        entry.target.style.transform = 'translateY(0)';
                    }
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Observe career page elements
    const animatedElements = document.querySelectorAll('.career-carousel-container, .join-us-form-container');
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

// Add form field animation styles
function addFormAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Form validation styles */
        .field-error input,
        .field-error select,
        .field-error textarea {
            border-color: #dc3545 !important;
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
        }
        
        .field-success input,
        .field-success select,
        .field-success textarea {
            border-color: #28a745 !important;
            box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1) !important;
        }
        
        .field-error-message {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
        }
        
        /* Message animations */
        @keyframes slideInDown {
            from {
                transform: translateY(-20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutUp {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(-20px);
                opacity: 0;
            }
        }
        
        /* Enhanced hover effects for career page */
        .career-cta-button:hover {
            transform: translateY(-3px) scale(1.05);
        }
        
        .career-slide-overlay {
            transition: all 0.3s ease;
        }
        
        .career-slide:hover .career-slide-overlay {
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
        }
    `;
    document.head.appendChild(style);
}

// Initialize career page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize career-specific functionality
    new CareerCarousel();
    new CareerFormHandler();
    initCareerButtonHandlers();
    initCareerScrollAnimations();
    addFormAnimationStyles();
    
    console.log('Career page functionality initialized');
    
    // Re-use existing contact form functionality from main script
    if (typeof initContactForm === 'function') {
        initContactForm();
    }
});

// Handle page visibility for carousel
document.addEventListener('visibilitychange', () => {
    const carousel = document.querySelector('.career-carousel-container');
    if (carousel) {
        if (document.hidden) {
            // Pause carousel when tab is hidden
            carousel.style.animationPlayState = 'paused';
        } else {
            // Resume carousel when tab becomes visible
            carousel.style.animationPlayState = 'running';
        }
    }
}); 