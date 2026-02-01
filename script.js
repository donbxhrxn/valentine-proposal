// DOM Elements
const screens = document.querySelectorAll('.screen');
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
const continueButton = document.getElementById('continue-to-proposal');
const restartButton = document.getElementById('restart-button');
const screenshotButton = document.getElementById('screenshot-button');
const simpleYesButton = document.getElementById('simple-yes');

// Game State
let currentScreen = 0;
let musicEnabled = true;
let caughtHearts = 0;
const totalHearts = 5;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Start with opening screen
    showScreen(0);
    
    // Set up music
    bgMusic.volume = 0.3;
    
    // Set up event listeners
    setupEventListeners();
    
    // Start background music
    setTimeout(() => {
        if (musicEnabled) {
            bgMusic.play().catch(e => {
                console.log("Autoplay prevented");
            });
        }
    }, 1000);
    
    // Detect mobile device
    if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.body.classList.add('mobile');
    }
});

// Show specific screen
function showScreen(screenIndex) {
    screens.forEach(screen => screen.classList.remove('active'));
    screens[screenIndex].classList.add('active');
    currentScreen = screenIndex;
    
    // Special setup for each screen
    switch(screenIndex) {
        case 0: // Opening screen
            animateEnvelope();
            break;
        case 1: // Date screen
            // Nothing special needed
            break;
        case 2: // Proposal screen
            setupProposal();
            break;
        case 3: // Celebration screen
            startCelebration();
            break;
    }
}

// Animate envelope opening
function animateEnvelope() {
    setTimeout(() => {
        const envelopeTop = document.querySelector('.envelope-top');
        const letter = document.querySelector('.letter');
        
        if (envelopeTop && letter) {
            envelopeTop.style.transform = 'rotateX(180deg)';
            letter.style.transform = 'translateY(0)';
        }
    }, 500);
}

// Setup event listeners
function setupEventListeners() {
    // Click to proceed from opening screen
    document.getElementById('opening-screen').addEventListener('click', () => {
        if (currentScreen === 0) {
            showScreen(1);
            playSound('select');
        }
    });
    
    // Continue to proposal button
    if (continueButton) {
        continueButton.addEventListener('click', () => {
            showScreen(2);
            playSound('select');
        });
    }
    
    // Restart button
    if (restartButton) {
        restartButton.addEventListener('click', restartExperience);
    }
    
    // Screenshot button
    if (screenshotButton) {
        screenshotButton.addEventListener('click', takeScreenshot);
    }
    
    // Simple yes button (alternative)
    if (simpleYesButton) {
        simpleYesButton.addEventListener('click', celebrateYes);
    }
    
    // Music toggle
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
    
    // Add tap sounds to buttons
    document.querySelectorAll('.cute-button').forEach(button => {
        button.addEventListener('click', () => playSound('tap'));
        button.addEventListener('mouseenter', () => {
            if (!document.body.classList.contains('mobile')) {
                playSound('hover');
            }
        });
    });
}

// Setup proposal interaction
function setupProposal() {
    // Reset heart count
    caughtHearts = 0;
    updateHeartCounter();
    
    // Setup heart catching
    const hearts = document.querySelectorAll('.catch-heart');
    hearts.forEach(heart => {
        heart.classList.remove('caught');
        
        // Click/tap to catch heart
        heart.addEventListener('click', () => catchHeart(heart));
        
        // Mobile touch feedback
        heart.addEventListener('touchstart', () => {
            heart.style.transform = 'scale(1.1)';
        });
        
        heart.addEventListener('touchend', () => {
            heart.style.transform = '';
        });
    });
    
    // Generate floating hearts
    generateFloatingHearts();
}

// Catch a heart
function catchHeart(heartElement) {
    if (heartElement.classList.contains('caught')) return;
    
    // Mark as caught
    heartElement.classList.add('caught');
    caughtHearts++;
    
    // Play sound
    playSound('heart');
    
    // Update counter and progress
    updateHeartCounter();
    
    // Check if all hearts caught
    if (caughtHearts >= totalHearts) {
        // All hearts caught - celebrate!
        setTimeout(() => {
            celebrateYes();
        }, 800);
    }
}

// Update heart counter display
function updateHeartCounter() {
    const countElement = document.getElementById('caught-count');
    const progressFill = document.querySelector('.progress-fill');
    
    if (countElement) {
        countElement.textContent = caughtHearts;
    }
    
    if (progressFill) {
        const percentage = (caughtHearts / totalHearts) * 100;
        progressFill.style.width = `${percentage}%`;
    }
}

// Generate floating hearts background
function generateFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    if (!container) return;
    
    container.innerHTML = '';
    
    const heartTypes = ['💖', '💗', '💓', '💕', '💞'];
    const numHearts = window.innerWidth < 768 ? 15 : 25;
    
    for (let i = 0; i < numHearts; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];
        
        // Random properties
        const left = Math.random() * 100;
        const size = 20 + Math.random() * 25;
        const duration = 4 + Math.random() * 4;
        const delay = Math.random() * 5;
        const color = getRandomPastelColor();
        
        heart.style.position = 'absolute';
        heart.style.left = `${left}%`;
        heart.style.top = '-50px';
        heart.style.fontSize = `${size}px`;
        heart.style.color = color;
        heart.style.opacity = '0.7';
        heart.style.zIndex = '1';
        heart.style.pointerEvents = 'none';
        heart.style.animation = `floatHeartDown ${duration}s ${delay}s infinite linear`;
        
        container.appendChild(heart);
    }
}

// Get random pastel color
function getRandomPastelColor() {
    const colors = [
        '#ffb3cc', '#ff99bb', '#ff80b3', '#ff66a3',
        '#ffb3d9', '#ff99cc', '#ff80bf', '#ff66b2',
        '#ffccdd', '#ffb3c6'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Celebrate YES response
function celebrateYes() {
    // Play celebration sound
    playSound('celebration');
    
    // Show celebration screen after delay
    setTimeout(() => {
        showScreen(3);
    }, 800);
}

// Start celebration animation
function startCelebration() {
    // Generate confetti
    generateConfetti();
    
    // Generate balloons
    const balloonsContainer = document.querySelector('.floating-balloons');
    if (balloonsContainer) {
        balloonsContainer.innerHTML = '';
        
        for (let i = 0; i < 3; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.innerHTML = '🎈';
            
            const left = 20 + (i * 30);
            const delay = i * 2;
            
            balloon.style.position = 'absolute';
            balloon.style.left = `${left}%`;
            balloon.style.bottom = '0px';
            balloon.style.fontSize = '50px';
            balloon.style.animation = `balloonFloat 6s ${delay}s infinite ease-in-out`;
            
            balloonsContainer.appendChild(balloon);
        }
    }
    
    // Play celebration music
    if (musicEnabled) {
        const celebrationMusic = new Audio('https://assets.mixkit.co/music/preview/mixkit-happy-celebration-567.mp3');
        celebrationMusic.volume = 0.4;
        celebrationMusic.play().catch(e => console.log("Music play prevented"));
    }
}

// Generate confetti
function generateConfetti() {
    const container = document.querySelector('.confetti-area');
    if (!container) return;
    
    container.innerHTML = '';
    
    const confettiTypes = ['💖', '💗', '💓', '💕', '💞', '✨', '🌟'];
    const numConfetti = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < numConfetti; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.innerHTML = confettiTypes[Math.floor(Math.random() * confettiTypes.length)];
        
        const left = Math.random() * 100;
        const size = 20 + Math.random() * 25;
        const duration = 3 + Math.random() * 3;
        const delay = Math.random() * 5;
        const color = getRandomPastelColor();
        
        piece.style.position = 'absolute';
        piece.style.left = `${left}%`;
        piece.style.top = '-30px';
        piece.style.fontSize = `${size}px`;
        piece.style.color = color;
        piece.style.opacity = '0';
        piece.style.zIndex = '1';
        piece.style.pointerEvents = 'none';
        piece.style.animation = `confettiFall ${duration}s ${delay}s infinite linear`;
        
        container.appendChild(piece);
    }
}

// Play sounds
function playSound(type) {
    if (!musicEnabled) return;
    
    const sounds = {
        'tap': 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3',
        'hover': 'https://assets.mixkit.co/sfx/preview/mixkit-bubble-pop-up-3000.mp3',
        'select': 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3',
        'heart': 'https://assets.mixkit.co/sfx/preview/mixkit-heartbeat-love-901.mp3',
        'celebration': 'https://assets.mixkit.co/sfx/preview/mixkit-happy-crowd-laugh-464.mp3'
    };
    
    if (sounds[type]) {
        const audio = new Audio(sounds[type]);
        audio.volume = type === 'celebration' ? 0.5 : 0.3;
        audio.play().catch(e => console.log(`Sound ${type} play prevented`));
    }
}

// Toggle background music
function toggleMusic() {
    musicEnabled = !musicEnabled;
    const icon = musicToggle.querySelector('i');
    
    if (musicEnabled) {
        bgMusic.play().catch(e => {
            console.log("Music play prevented");
        });
        icon.className = 'fas fa-volume-up';
        musicToggle.style.background = 'linear-gradient(135deg, #ff80b3 0%, #ff4d8d 100%)';
    } else {
        bgMusic.pause();
        icon.className = 'fas fa-volume-mute';
        musicToggle.style.background = 'linear-gradient(135deg, #cccccc 0%, #999999 100%)';
    }
    
    // Play toggle sound
    playSound('tap');
}

// Restart the experience
function restartExperience() {
    // Reset game state
    currentScreen = 0;
    caughtHearts = 0;
    
    // Reset envelope
    const envelopeTop = document.querySelector('.envelope-top');
    const letter = document.querySelector('.letter');
    
    if (envelopeTop && letter) {
        envelopeTop.style.transform = 'rotateX(0deg)';
        letter.style.transform = 'translateY(15px)';
    }
    
    // Go back to opening screen
    showScreen(0);
    
    // Play restart sound
    playSound('select');
}

// Screenshot function (simulated)
function takeScreenshot() {
    playSound('tap');
    
    const screenshotMsg = document.createElement('div');
    screenshotMsg.innerHTML = '📸 Memory saved! 💖';
    screenshotMsg.style.position = 'fixed';
    screenshotMsg.style.top = '50%';
    screenshotMsg.style.left = '50%';
    screenshotMsg.style.transform = 'translate(-50%, -50%)';
    screenshotMsg.style.background = 'rgba(255, 255, 255, 0.95)';
    screenshotMsg.style.padding = '20px 30px';
    screenshotMsg.style.borderRadius = '20px';
    screenshotMsg.style.border = '4px solid #ff80b3';
    screenshotMsg.style.zIndex = '10000';
    screenshotMsg.style.fontSize = '20px';
    screenshotMsg.style.fontWeight = 'bold';
    screenshotMsg.style.color = '#ff3366';
    screenshotMsg.style.boxShadow = '0 10px 30px rgba(255, 128, 179, 0.5)';
    screenshotMsg.style.textAlign = 'center';
    
    document.body.appendChild(screenshotMsg);
    
    setTimeout(() => {
        screenshotMsg.remove();
    }, 2000);
}

// Add CSS for new animations
const style = document.createElement('style');
style.textContent = `
    @keyframes floatHeartDown {
        0% { 
            transform: translateY(-50px) rotate(0deg) scale(0.5); 
            opacity: 0; 
        }
        10% { 
            opacity: 0.7; 
        }
        90% { 
            opacity: 0.7; 
        }
        100% { 
            transform: translateY(100vh) rotate(360deg) scale(1); 
            opacity: 0; 
        }
    }
    
    .floating-heart {
        animation: floatHeartDown 6s infinite linear;
    }
    
    /* Mobile improvements */
    .mobile .catch-heart {
        cursor: pointer;
    }
    
    .mobile .catch-heart:active {
        transform: scale(1.2) !important;
    }
    
    /* Responsive improvements */
    @media (max-width: 480px) {
        .message-header h2 {
            font-size: 24px;
        }
        
        .message-body p {
            font-size: 18px;
        }
        
        .catch-heart {
            font-size: 40px;
            padding: 8px;
        }
        
        .hearts-to-catch {
            gap: 10px;
        }
    }
`;
document.head.appendChild(style);

// Handle window resize
window.addEventListener('resize', () => {
    if (currentScreen === 2) {
        generateFloatingHearts();
    }
    if (currentScreen === 3) {
        generateConfetti();
    }
});
