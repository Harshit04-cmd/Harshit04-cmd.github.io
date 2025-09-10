// ===== GLOBAL VARIABLES =====
let isScrolling = false;
let currentSection = 'home';

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeLoadingScreen();
    initializePortfolio();
});

// ===== LOADING SCREEN =====
function initializeLoadingScreen() {
    const pageLoader = document.getElementById('pageLoader');
    const progressBar = document.getElementById('progressBar');
    const loadingText = document.getElementById('loadingText');
    
    // Loading messages
    const loadingMessages = [
        'Loading...',
        'Preparing portfolio...',
        'Loading projects...',
        'Setting up animations...',
        'Almost ready...',
        'Welcome!'
    ];
    
    let progress = 0;
    let messageIndex = 0;
    
    // Simulate loading progress
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15 + 5; // Random increment between 5-20
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // Final message
            loadingText.textContent = loadingMessages[loadingMessages.length - 1];
            
            // Hide loading screen after completion
            setTimeout(() => {
                pageLoader.classList.add('hidden');
                
                // Remove from DOM after transition
                setTimeout(() => {
                    if (pageLoader.parentNode) {
                        pageLoader.parentNode.removeChild(pageLoader);
                    }
                }, 800);
            }, 500);
        } else {
            // Update progress bar
            progressBar.style.width = progress + '%';
            
            // Update loading message
            const newMessageIndex = Math.floor((progress / 100) * (loadingMessages.length - 1));
            if (newMessageIndex !== messageIndex && newMessageIndex < loadingMessages.length - 1) {
                messageIndex = newMessageIndex;
                loadingText.textContent = loadingMessages[messageIndex];
            }
        }
    }, 200); // Update every 200ms
    
    // Ensure minimum loading time of 2 seconds
    setTimeout(() => {
        if (progress < 100) {
            progress = 100;
            progressBar.style.width = '100%';
            loadingText.textContent = loadingMessages[loadingMessages.length - 1];
            
            setTimeout(() => {
                pageLoader.classList.add('hidden');
                setTimeout(() => {
                    if (pageLoader.parentNode) {
                        pageLoader.parentNode.removeChild(pageLoader);
                    }
                }, 800);
            }, 500);
        }
    }, 2000);
}

// ===== MAIN INITIALIZATION =====
function initializePortfolio() {
    // Initialize all components
    initializeNavigation();
    initializeScrollAnimations();
    initializeTypingEffect();
    initializeStatsCounter();
    initializeContactForm();
    initializeSmoothScrolling();
    initializeParallaxEffect();
    initializeThemeToggle();
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink();
    });
    
    // Set initial active link
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    currentSection = current;
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Special handling for stats counter
                if (entry.target.classList.contains('stats-grid')) {
                    animateStats();
                }
                
                // Special handling for section titles
                if (entry.target.classList.contains('section-title')) {
                    entry.target.classList.add('animate');
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.animate-on-scroll, .animate-left, .animate-right, .animate-scale, ' +
        '.skill-category, .project-card, .contact-item, .contact-form, ' +
        '.stats-grid, .section-title'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== TYPING EFFECT =====
function initializeTypingEffect() {
    const nameElement = document.querySelector('.hero-title .name');
    const roleElement = document.querySelector('.hero-title .role');
    
    if (nameElement && roleElement) {
        const name = nameElement.textContent;
        const role = roleElement.textContent;
        
        // Clear content
        nameElement.textContent = '';
        roleElement.textContent = '';
        
        // Type name first
        setTimeout(() => {
            typeWriter(nameElement, name, 100, () => {
                // Type role after name is complete
                setTimeout(() => {
                    typeWriter(roleElement, role, 80);
                }, 500);
            });
        }, 1000);
    }
}

function typeWriter(element, text, speed, callback) {
    let i = 0;
    element.style.borderRight = '3px solid var(--accent-blue)';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Remove cursor after typing
            setTimeout(() => {
                element.style.borderRight = 'none';
                if (callback) callback();
            }, 1000);
        }
    }
    
    type();
}

// ===== STATS COUNTER =====
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current);
                stat.classList.add('counting');
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
                stat.classList.remove('counting');
            }
        };
        
        updateCounter();
    });
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // Add input validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearValidation);
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validate form
    if (!validateForm(form)) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }, 2000);
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateInput({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    const type = input.type;
    
    // Remove existing error styling
    input.classList.remove('error');
    
    let isValid = true;
    
    // Check if required field is empty
    if (input.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
        }
    }
    
    // Add error styling if invalid
    if (!isValid) {
        input.classList.add('error');
        input.classList.add('shake-error');
        setTimeout(() => {
            input.classList.remove('shake-error');
        }, 500);
    }
    
    return isValid;
}

function clearValidation(e) {
    const input = e.target;
    input.classList.remove('error');
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== PARALLAX EFFECT =====
function initializeParallaxEffect() {
    window.addEventListener('scroll', () => {
        if (isScrolling) return;
        
        isScrolling = true;
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            isScrolling = false;
        });
    });
}

// ===== THEME TOGGLE =====
function initializeThemeToggle() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--accent-blue);
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    `;
    
    document.body.appendChild(themeToggle);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
        
        // Add transition effect
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Hover effect
    themeToggle.addEventListener('mouseenter', () => {
        themeToggle.style.transform = 'scale(1.1)';
    });
    
    themeToggle.addEventListener('mouseleave', () => {
        themeToggle.style.transform = 'scale(1)';
    });
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance
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

// Throttle function for scroll events
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

// Get element position
function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
        width: rect.width,
        height: rect.height
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

// ===== PERFORMANCE OPTIMIZATIONS =====

// Optimize scroll events
const optimizedScrollHandler = throttle(() => {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

// Optimize resize events
const optimizedResizeHandler = debounce(() => {
    // Handle resize-specific updates here
    console.log('Window resized');
}, 250);

window.addEventListener('resize', optimizedResizeHandler);

// ===== ACCESSIBILITY =====

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Focus management for mobile menu
document.addEventListener('focusin', (e) => {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    if (navMenu.classList.contains('active')) {
        const focusableElements = navMenu.querySelectorAll('a, button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.target === hamburger) {
            firstElement.focus();
        }
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.error);
    // You can add error reporting here
});

// ===== CONSOLE STYLING =====
console.log(
    '%c🚀 Portfolio Website Loaded Successfully! %c\n' +
    'Built with ❤️ using vanilla JavaScript\n' +
    'Features: Smooth animations, responsive design, and modern interactions',
    'color: #3B82F6; font-size: 16px; font-weight: bold;',
    'color: #6B7280; font-size: 12px;'
);
