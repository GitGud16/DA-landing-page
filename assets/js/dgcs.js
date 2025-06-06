// DGCS Page JavaScript

// Feature Cards Hover Effects and Interactions
class DGCSFeatures {
    constructor() {
        this.featureCards = document.querySelectorAll('.feature-card');
        this.expandedCard = null;
        this.hoverTimeout = null;
        this.init();
    }
    
    init() {
        if (this.featureCards.length === 0) return;
        
        this.featureCards.forEach((card, index) => {
            this.setupCardInteractions(card, index);
        });
        
        // Close expanded card when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.feature-card') && this.expandedCard) {
                this.collapseCard(this.expandedCard);
            }
        });
        
        console.log('DGCS Features initialized with', this.featureCards.length, 'cards');
    }
    
    setupCardInteractions(card, index) {
        // Expand on hover with delay
        card.addEventListener('mouseenter', () => {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = setTimeout(() => {
                this.expandCard(card);
            }, 300); // 300ms delay before expanding
        });
        
        // Collapse on mouse leave with small delay
        card.addEventListener('mouseleave', () => {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = setTimeout(() => {
                if (this.expandedCard === card) {
                    this.collapseCard(card);
                }
            }, 100); // Small delay to prevent flickering
        });
        
        // Load image when card is first hovered
        const featureImage = card.querySelector('.feature-image img');
        if (featureImage && !featureImage.src) {
            const imageMap = {
                'drones': 'assets/images/carousel1.avif',
                'missions': 'assets/images/carousel2.avif', 
                'simulator': 'assets/images/carousel3.jpeg',
                'camera': 'assets/images/DGCS-background.avif',
                'support': 'assets/images/our-solutions-background.avif',
                'drones-types': 'assets/images/join-the-team.webp',
                'language': 'assets/images/carousel1.avif'
            };
            
            const feature = card.dataset.feature;
            featureImage.src = imageMap[feature] || 'assets/images/carousel1.avif';
            featureImage.alt = card.querySelector('h3').textContent;
        }
    }
    
    expandCard(card) {
        // Collapse any currently expanded card
        if (this.expandedCard && this.expandedCard !== card) {
            this.collapseCard(this.expandedCard);
        }
        
        card.classList.add('expanded');
        this.expandedCard = card;
        
        // Removed scroll into view - no more page jumping on hover
    }
    
    collapseCard(card) {
        card.classList.remove('expanded');
        if (this.expandedCard === card) {
            this.expandedCard = null;
        }
    }
}

// Pricing Cards Interactions
class DGCSPricing {
    constructor() {
        this.pricingCards = document.querySelectorAll('.pricing-card');
        this.pricingButtons = document.querySelectorAll('.pricing-button');
        this.init();
    }
    
    init() {
        if (this.pricingCards.length === 0) return;
        
        this.setupPricingInteractions();
        this.setupButtonHandlers();
        
        console.log('DGCS Pricing initialized with', this.pricingCards.length, 'plans');
    }
    
    setupPricingInteractions() {
        this.pricingCards.forEach((card, index) => {
            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                this.highlightCard(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.highlightCard(card, false);
            });
        });
    }
    
    highlightCard(card, isHovering) {
        const header = card.querySelector('.pricing-header-card');
        
        if (isHovering) {
            card.style.zIndex = '5';
            if (header) {
                header.style.transform = 'scale(1.02)';
            }
        } else {
            card.style.zIndex = '1';
            if (header) {
                header.style.transform = 'scale(1)';
            }
        }
    }
    
    setupButtonHandlers() {
        this.pricingButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e, button);
            });
        });
    }
    
    handleButtonClick(e, button) {
        if (button.disabled) {
            e.preventDefault();
            return;
        }
        
        const buttonText = button.textContent.trim();
        
        switch (buttonText) {
            case 'Buy Now!':
                this.handleBuyNow(button);
                break;
            case 'Contact Us!':
                this.handleContactUs(button);
                break;
            case 'Coming Soon':
                e.preventDefault();
                this.showComingSoonMessage();
                break;
        }
    }
    
    handleBuyNow(button) {
        // Add loading state
        const originalText = button.textContent;
        button.textContent = 'Processing...';
        button.disabled = true;
        
        // Simulate processing
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            this.showMessage('Redirecting to payment...', 'info');
        }, 1000);
        
        // In a real application, redirect to payment processor
        console.log('PRO plan purchase initiated');
    }
    
    handleContactUs(button) {
        // Scroll to contact form specifically, not contact info
        const contactForm = document.querySelector('.contact-form-area');
        if (contactForm) {
            // Use getBoundingClientRect for accurate positioning
            const rect = contactForm.getBoundingClientRect();
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            const headerHeight = 80; // Fixed header height
            const targetPosition = rect.top + currentScroll - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Highlight contact form
            setTimeout(() => {
                if (contactForm) {
                    contactForm.style.animation = 'pulse 2s ease-in-out';
                }
            }, 800);
        } else {
            // Fallback to general contact section if form not found
            const contactSection = document.querySelector('.contact-us');
            if (contactSection) {
                const rect = contactSection.getBoundingClientRect();
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                const headerHeight = 80;
                const targetPosition = rect.top + currentScroll - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    showComingSoonMessage() {
        this.showMessage('Enterprise features are coming soon! Stay tuned for updates.', 'info');
    }
    
    showMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.pricing-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `pricing-message ${type}`;
        messageElement.innerHTML = `
            <i class="fas ${type === 'info' ? 'fa-info-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Style the message
        messageElement.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'info' ? '#d1ecf1' : '#d4edda'};
            color: ${type === 'info' ? '#0c5460' : '#155724'};
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;
        
        document.body.appendChild(messageElement);
        
        // Remove message after 4 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => messageElement.remove(), 300);
            }
        }, 4000);
    }
}

// Enhanced Scroll Animations for DGCS Page
class DGCSScrollAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        const isMobile = window.innerWidth <= 768;
        
        const observerOptions = {
            threshold: isMobile ? 0.05 : 0.1,
            rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                        entry.target.style.opacity = '1';
                        if (!isMobile) {
                            entry.target.style.transform = 'translateY(0)';
                        }
                    }, index * 100);
                }
            });
        }, observerOptions);
        
        this.observeElements();
        console.log('DGCS Scroll animations initialized');
    }
    
    observeElements() {
        const animatedElements = document.querySelectorAll(`
            .dgcs-preview-container,
            .feature-card,
            .pricing-card
        `);
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            if (window.innerWidth > 768) {
                el.style.transform = 'translateY(40px)';
                el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            } else {
                el.style.transition = 'opacity 0.6s ease';
            }
            this.observer.observe(el);
        });
    }
}

// Demo Link Handler
function initDemoLinkHandler() {
    const demoLinks = document.querySelectorAll('.demo-link');
    
    demoLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create and show demo booking form
            showDemoBookingForm();
        });
    });
}

function showDemoBookingForm() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'demo-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create form container
    const formContainer = document.createElement('div');
    formContainer.className = 'demo-form-container';
    formContainer.style.cssText = `
        background: var(--color-bg-secondary);
        padding: 2rem;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideInUp 0.4s ease;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
        position: relative;
    `;
    
    formContainer.innerHTML = `
        <button class="close-demo-form" style="
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--color-text-secondary);
            cursor: pointer;
            transition: color 0.3s ease;
        ">×</button>
        
        <h3 style="color: var(--color-text-primary); margin-bottom: 1rem; text-align: center;">
            Book a DGCS Demo
        </h3>
        
        <p style="color: var(--color-text-secondary); margin-bottom: 2rem; text-align: center;">
            Schedule a personalized demonstration of our Ground Control Station
        </p>
        
        <form class="demo-booking-form">
            <div class="form-group" style="margin-bottom: 1rem;">
                <input type="text" placeholder="Full Name" required style="
                    width: 100%;
                    padding: 1rem;
                    border: 2px solid var(--color-border);
                    border-radius: 10px;
                    background: var(--color-bg-primary);
                    color: var(--color-text-primary);
                    font-size: 1rem;
                ">
            </div>
            
            <div class="form-group" style="margin-bottom: 1rem;">
                <input type="email" placeholder="Email Address" required style="
                    width: 100%;
                    padding: 1rem;
                    border: 2px solid var(--color-border);
                    border-radius: 10px;
                    background: var(--color-bg-primary);
                    color: var(--color-text-primary);
                    font-size: 1rem;
                ">
            </div>
            
            <div class="form-group" style="margin-bottom: 1rem;">
                <input type="tel" placeholder="Phone Number" required style="
                    width: 100%;
                    padding: 1rem;
                    border: 2px solid var(--color-border);
                    border-radius: 10px;
                    background: var(--color-bg-primary);
                    color: var(--color-text-primary);
                    font-size: 1rem;
                ">
            </div>
            
            <div class="form-group" style="margin-bottom: 1rem;">
                <input type="text" placeholder="Company Name" style="
                    width: 100%;
                    padding: 1rem;
                    border: 2px solid var(--color-border);
                    border-radius: 10px;
                    background: var(--color-bg-primary);
                    color: var(--color-text-primary);
                    font-size: 1rem;
                ">
            </div>
            
            <div class="form-group" style="margin-bottom: 2rem;">
                <textarea placeholder="What would you like to see in the demo?" rows="3" style="
                    width: 100%;
                    padding: 1rem;
                    border: 2px solid var(--color-border);
                    border-radius: 10px;
                    background: var(--color-bg-primary);
                    color: var(--color-text-primary);
                    font-size: 1rem;
                    resize: vertical;
                "></textarea>
            </div>
            
            <button type="submit" style="
                width: 100%;
                padding: 1rem 2rem;
                background: linear-gradient(45deg, var(--color-secondary), #d4c29a);
                color: var(--color-bg-primary);
                border: none;
                border-radius: 50px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
            ">Book Demo</button>
        </form>
    `;
    
    overlay.appendChild(formContainer);
    document.body.appendChild(overlay);
    
    // Close handlers
    const closeBtn = formContainer.querySelector('.close-demo-form');
    closeBtn.addEventListener('click', () => {
        closeDemoForm(overlay);
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeDemoForm(overlay);
        }
    });
    
    // Form submission
    const form = formContainer.querySelector('.demo-booking-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleDemoBooking(form, overlay);
    });
}

function closeDemoForm(overlay) {
    overlay.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.remove();
        }
    }, 300);
}

function handleDemoBooking(form, overlay) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Booking...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        closeDemoForm(overlay);
        showSuccessMessage('Demo booking request sent! We will contact you soon.');
    }, 1500);
}

function showSuccessMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--color-bg-secondary);
        color: var(--color-text-primary);
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        text-align: center;
        animation: popIn 0.4s ease;
        border: 2px solid var(--color-secondary);
    `;
    
    messageEl.innerHTML = `
        <i class="fas fa-check-circle" style="color: var(--color-secondary); font-size: 2rem; margin-bottom: 1rem;"></i>
        <p style="margin: 0; font-weight: 500;">${message}</p>
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.style.animation = 'popOut 0.3s ease';
        setTimeout(() => messageEl.remove(), 300);
    }, 3000);
}

// Add CSS animations
function addDGCSAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes slideInUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100px);
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
                transform: translateX(100px);
                opacity: 0;
            }
        }
        
        @keyframes popIn {
            from {
                transform: translate(-50%, -50%) scale(0.8);
                opacity: 0;
            }
            to {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
        }
        
        @keyframes popOut {
            from {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
            to {
                transform: translate(-50%, -50%) scale(0.8);
                opacity: 0;
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(186, 165, 116, 0.4);
            }
            50% {
                transform: scale(1.02);
                box-shadow: 0 0 0 20px rgba(186, 165, 116, 0);
            }
        }
        
        /* Mobile feature card active state */
        .feature-card.mobile-active {
            transform: scale(1.02);
            z-index: 10;
        }
        
        .feature-card.mobile-active .feature-image {
            opacity: 1;
        }
        
        .feature-card.mobile-active .feature-content {
            background: rgba(42, 63, 77, 0.9);
        }
        
        .feature-card.mobile-active .feature-content h3,
        .feature-card.mobile-active .feature-content p {
            color: #ffffff;
        }
    `;
    document.head.appendChild(style);
}

// Initialize DGCS page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DGCS-specific functionality
    new DGCSFeatures();
    new DGCSPricing();
    new DGCSScrollAnimations();
    initDemoLinkHandler();
    addDGCSAnimations();
    
    console.log('DGCS page functionality initialized');
    
    // Re-use existing contact form functionality from main script
    if (typeof initContactForm === 'function') {
        initContactForm();
    }
});

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any ongoing animations when tab is hidden
        const animatedElements = document.querySelectorAll('.feature-card, .pricing-card');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when tab becomes visible
        const animatedElements = document.querySelectorAll('.feature-card, .pricing-card');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
}); 