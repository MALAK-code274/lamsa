// ============================================================================
// FLOATING EMOJI LOCAL MOVEMENT WITH MOUSE INTERACTION
// ============================================================================

class FloatingEmoji {
    constructor(element) {
        this.element = element;
        this.index = parseInt(element.dataset.index) || 0;
        
        // Store the original CSS position values
        this.originalLeft = element.style.left;
        this.originalRight = element.style.right;
        this.originalTop = element.style.top;
        this.originalBottom = element.style.bottom;
        
        // Animation parameters
        this.time = Math.random() * Math.PI * 2;
        this.speed = 0.005 + Math.random() * 0.008;
        this.rangeX = 40 + Math.random() * 40; // 40-80px range
        this.rangeY = 40 + Math.random() * 40;
        this.rotationSpeed = 0.3 + Math.random() * 0.4;
        this.rotation = 0;
        
        // Mouse interaction
        this.offsetX = 0;
        this.offsetY = 0;
        this.targetOffsetX = 0;
        this.targetOffsetY = 0;
        this.mouseDistance = 999;
    }
    
    update(mouseX, mouseY) {
        // Update time for continuous movement
        this.time += this.speed;
        
        // Calculate smooth local floating movement using sine waves
        // Different phase for X and Y to create organic movement
        this.offsetX = Math.sin(this.time) * this.rangeX;
        this.offsetY = Math.cos(this.time * 0.7) * this.rangeY;
        
        // Update rotation
        this.rotation += this.rotationSpeed;
        
        // Calculate distance from mouse
        const rect = this.element.getBoundingClientRect();
        const emojiCenterX = rect.left + rect.width / 2;
        const emojiCenterY = rect.top + rect.height / 2;
        
        const dx = emojiCenterX - mouseX;
        const dy = emojiCenterY - mouseY;
        this.mouseDistance = Math.sqrt(dx * dx + dy * dy);
        
        // Apply mouse push force (smooth, not instant)
        const pushRadius = 150; // pixels
        if (this.mouseDistance < pushRadius) {
            const pushStrength = (pushRadius - this.mouseDistance) / pushRadius;
            const angle = Math.atan2(dy, dx);
            
            this.targetOffsetX = Math.cos(angle) * pushStrength * 60;
            this.targetOffsetY = Math.sin(angle) * pushStrength * 60;
        } else {
            this.targetOffsetX = 0;
            this.targetOffsetY = 0;
        }
        
        // Smoothly interpolate to target offset (adds elasticity)
        this.offsetX += (this.targetOffsetX - this.offsetX) * 0.08;
        this.offsetY += (this.targetOffsetY - this.offsetY) * 0.08;
    }
    
    render() {
        this.element.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) rotate(${this.rotation}deg)`;
    }
}

let floatingEmojis = [];
let mouseX = 0;
let mouseY = 0;

function initFloatingEmojis() {
    floatingEmojis = Array.from(document.querySelectorAll('.floating-emoji')).map(el => new FloatingEmoji(el));
}

function animateFloatingEmojis() {
    floatingEmojis.forEach(emoji => {
        emoji.update(mouseX, mouseY);
        emoji.render();
    });
    
    requestAnimationFrame(animateFloatingEmojis);
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initFloatingEmojis, 50);
        animateFloatingEmojis();
    });
} else {
    setTimeout(initFloatingEmojis, 50);
    animateFloatingEmojis();
}

// Scroll Progress Tracking
function updateScrollProgress() {
    const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;

    // Update progress bar
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    if (progressBar && progressText) {
        progressBar.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
    }

    // Update progress rings
    updateProgressRings(progress);

    // Trigger animations on scroll
    animateOnScroll();
}

function updateProgressRings(progress) {
    const rings = document.querySelectorAll('.progress-ring');
    
    rings.forEach((ring) => {
        const targetProgress = parseInt(ring.dataset.progress);
        const section = ring.closest('.stage');
        
        if (section) {
            // Get section boundaries
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            const viewportCenter = window.scrollY + window.innerHeight / 2;
            
            // Calculate how far through this section we are
            let sectionProgress = 0;
            if (viewportCenter >= sectionTop && viewportCenter <= sectionBottom) {
                sectionProgress = ((viewportCenter - sectionTop) / sectionHeight) * 100;
            } else if (viewportCenter > sectionBottom) {
                sectionProgress = 100;
            }
            
            // Map section progress to target progress
            const ringProgress = (sectionProgress / 100) * targetProgress;
            const circle = ring.querySelector('.progress-ring-fill');
            
            if (circle) {
                const circumference = 2 * Math.PI * 45;
                const offset = circumference - (ringProgress / 100) * circumference;
                circle.style.strokeDashoffset = offset;
            }
        } else {
            // Fallback: use overall progress
            const ringProgress = Math.min((progress / 100) * targetProgress, targetProgress);
            const circle = ring.querySelector('.progress-ring-fill');
            
            if (circle) {
                const circumference = 2 * Math.PI * 45;
                const offset = circumference - (ringProgress / 100) * circumference;
                circle.style.strokeDashoffset = offset;
            }
        }
    });
}

// Tab Switching
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;

            // Remove active class
            tabButtons.forEach((btn) => btn.classList.remove('active'));
            tabContents.forEach((content) => content.classList.remove('active'));

            // Add active class
            button.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// Flip Card Interactions
function setupFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');

    flipCards.forEach((card) => {
        card.addEventListener('click', () => {
            const inner = card.querySelector('.flip-card-inner');
            if (inner.style.transform === 'rotateY(180deg)') {
                inner.style.transform = 'rotateY(0deg)';
            } else {
                inner.style.transform = 'rotateY(180deg)';
            }
        });
    });
}

// Exercise Card Tilt Effect
function setupExerciseCards() {
    const exerciseCards = document.querySelectorAll('.exercise-card');

    exerciseCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return; // Disable on mobile

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const angleX = (y - centerY) * 0.1;
            const angleY = (centerX - x) * 0.1;

            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    });
}

// Scroll Animation
function animateOnScroll() {
    const elements = document.querySelectorAll('.stage, .stage-header');

    elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75;

        if (isVisible) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0) rotateX(0deg)';
        }
    });
}

// Confetti Animation
function triggerConfetti(element) {
    const confetti = element.querySelector('.confetti');
    if (!confetti || window.innerWidth <= 480) return;

    for (let i = 0; i < 20; i++) {
        const piece = document.createElement('div');
        piece.style.position = 'absolute';
        piece.style.width = '10px';
        piece.style.height = '10px';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.top = '-10px';
        piece.style.pointerEvents = 'none';

        // Random confetti colors
        const colors = ['#2ecc71', '#ff9500', '#a9dfbf', '#ffb84d'];
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';

        confetti.appendChild(piece);

        // Animate
        let top = -10;
        let left = parseFloat(piece.style.left);
        let rotation = 0;

        const fall = setInterval(() => {
            top += Math.random() * 8 + 3;
            left += (Math.random() - 0.5) * 10;
            rotation += Math.random() * 20;
            piece.style.top = top + 'px';
            piece.style.left = left + 'px';
            piece.style.transform = `rotate(${rotation}deg)`;
            piece.style.opacity = 1 - top / window.innerHeight;

            if (top > window.innerHeight) {
                clearInterval(fall);
                piece.remove();
            }
        }, 30);
    }
}

// Trigger confetti on milestone visibility
function checkMilestones() {
    const milestones = document.querySelectorAll('.milestone, .final-milestone');

    milestones.forEach((milestone) => {
        const rect = milestone.getBoundingClientRect();
        if (
            rect.top < window.innerHeight * 0.75 &&
            rect.bottom > 0 &&
            !milestone.classList.contains('triggered')
        ) {
            milestone.classList.add('triggered');
            triggerConfetti(milestone);
        }
    });
}

// Parallax Scrolling Effect
function parallaxScroll() {
    if (window.innerWidth <= 768) return;

    const stages = document.querySelectorAll('.stage');
    stages.forEach((stage) => {
        const rect = stage.getBoundingClientRect();
        const offset = (window.innerHeight - rect.top) * 0.5;
        stage.style.transform = `translateY(${offset * 0.1}px)`;
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupFlipCards();
    setupExerciseCards();

    // Scroll events
    window.addEventListener('scroll', () => {
        updateScrollProgress();
        checkMilestones();
        parallaxScroll();
        animateOnScroll();
    });

    // Initial animations
    updateScrollProgress();
    checkMilestones();
});

// Smooth scroll for anchor links
document.addEventListener('click', (e) => {
    if (e.target.closest('a[href^="#"]')) {
        e.preventDefault();
        const href = e.target.closest('a').getAttribute('href');
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
});
