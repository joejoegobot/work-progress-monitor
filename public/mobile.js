// Mobile-specific functionality for the Work Progress Monitor

document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile navigation
    initMobileNav();
    
    // Add touch-friendly enhancements
    addTouchEnhancements();
    
    // Set up mobile-specific UI behaviors
    setupMobileBehaviors();
});

function initMobileNav() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Scroll to appropriate section
            const tab = this.getAttribute('data-tab');
            scrollToSection(tab);
        });
    });
}

function scrollToSection(section) {
    switch(section) {
        case 'stats':
            document.querySelector('.stats-container').scrollIntoView({ behavior: 'smooth' });
            break;
        case 'projects':
            document.querySelector('.projects-section').scrollIntoView({ behavior: 'smooth' });
            break;
        case 'add':
            document.querySelector('#project-form').scrollIntoView({ behavior: 'smooth' });
            break;
        case 'tasks':
            document.querySelector('.tasks-section').scrollIntoView({ behavior: 'smooth' });
            break;
    }
}

function addTouchEnhancements() {
    // Add touch feedback for buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        button.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
            // Small delay to keep visual feedback
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        });
    });
    
    // Enhance form inputs for mobile
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            // Adjust layout when inputs are focused on mobile
            if (window.innerWidth < 768) {
                document.body.classList.add('input-focused');
            }
        });
        
        input.addEventListener('blur', function() {
            document.body.classList.remove('input-focused');
        });
    });
}

function setupMobileBehaviors() {
    // Add pull-to-refresh simulation
    let startY = 0;
    let currentY = 0;
    
    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].pageY;
    });
    
    document.addEventListener('touchmove', (e) => {
        currentY = e.touches[0].pageY;
        
        // Only allow pull-down on top of page
        if (window.scrollY === 0 && currentY > startY) {
            e.preventDefault();
            const pullDistance = currentY - startY;
            
            // Visual feedback for pull-to-refresh
            if (pullDistance > 80) {
                document.body.style.transform = `translateY(${pullDistance * 0.5}px)`;
            }
        }
    });
    
    document.addEventListener('touchend', () => {
        if (window.scrollY === 0 && (currentY - startY) > 80) {
            // Refresh data when pulled far enough
            refreshData();
        }
        
        // Reset transform
        document.body.style.transform = '';
    });
    
    // Add swipe gestures for quick actions
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, false);
}

function refreshData() {
    // Show refresh indicator
    const refreshIndicator = document.createElement('div');
    refreshIndicator.id = 'refresh-indicator';
    refreshIndicator.innerHTML = '🔄';
    refreshIndicator.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2em;
        z-index: 1000;
        background: rgba(255, 255, 255, 0.9);
        padding: 20px;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;
    document.body.appendChild(refreshIndicator);
    
    // Animate the refresh indicator
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Reload data after a short delay
    setTimeout(() => {
        location.reload();
        document.body.removeChild(refreshIndicator);
        document.head.removeChild(style);
    }, 1500);
}

function handleSwipeGesture() {
    const minSwipeDistance = 50;
    const swipeDistance = touchStartX - touchEndX;
    
    if (Math.abs(swipeDistance) < minSwipeDistance) return; // Not a valid swipe
    
    if (swipeDistance > 0) {
        // Swipe left - next tab
        console.log('Swiped left');
    } else {
        // Swipe right - previous tab
        console.log('Swiped right');
    }
}

// Add mobile-specific CSS dynamically
function addMobileStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        /* Mobile Navigation */
        .mobile-nav {
            display: none;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: white;
            border-top: 1px solid #eee;
            z-index: 100;
            justify-content: space-around;
            align-items: center;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        }
        
        .nav-btn {
            flex: 1;
            height: 100%;
            border: none;
            background: none;
            font-size: 1.5em;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .nav-btn.active {
            color: #2575fc;
            transform: scale(1.1);
        }
        
        .nav-btn:active, .nav-btn.touch-active {
            background-color: #f0f0f0;
            transform: scale(0.95);
        }
        
        /* Adjust layout when input is focused */
        body.input-focused {
            padding-bottom: 200px;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .mobile-nav {
                display: flex;
            }
            
            header {
                padding: 15px;
            }
            
            header h1 {
                font-size: 1.5rem;
            }
            
            .stats-container {
                grid-template-columns: 1fr 1fr;
            }
            
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .project-card {
                padding: 15px;
            }
        }
        
        @media (max-width: 480px) {
            .stats-container {
                grid-template-columns: 1fr;
            }
            
            .stat-card {
                padding: 15px;
            }
            
            .stat-value {
                font-size: 1.5rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize mobile styles
addMobileStyles();