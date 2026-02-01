// DOM Elements
const screens = document.querySelectorAll('.screen');
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
const riddleAnswer = document.getElementById('riddle-answer');
const submitAnswer = document.getElementById('submit-answer');
const feedback = document.getElementById('feedback');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const restartBtn = document.getElementById('restart-btn');
const restartNoBtn = document.getElementById('restart-no-btn');

// Game State
let currentScreen = 0;
let chosenPath = null;
let musicEnabled = true;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Start with opening screen
    showScreen(0);
    
    // Set up music
    bgMusic.volume = 0.3;
    
    // Set up event listeners
    setupEventListeners();
    
    // Start gentle background music
    setTimeout(() => {
        if (musicEnabled) {
            bgMusic.play().catch(e => console.log("Autoplay prevented:", e));
        }
    }, 1000);
});

// Show specific screen
function showScreen(screenIndex) {
    screens.forEach(screen => screen.classList.remove('active'));
    screens[screenIndex].classList.add('active');
    currentScreen = screenIndex;
    
    // Special animations for specific screens
    if (screenIndex === 0) {
        // Opening screen - animate envelope
        setTimeout(() => {
            const envelopeFlap = document.querySelector('.envelope-flap');
            const letter = document.querySelector('.letter');
            envelopeFlap.style.transform = 'rotateX(180deg)';
            letter.style.transform = 'translateY(0)';
        }, 500);
    } else if (screenIndex === 3) {
        // Riddle screen - animate gate opening when answer is correct
        setTimeout(() => {
            const gateLeft = document.querySelector('.gate-left');
            const gateRight = document.querySelector('.gate-right');
            const gateLock = document.querySelector('.gate-lock');
            
            gateLeft.style.transform = 'rotateY(-30deg)';
            gateRight.style.transform = 'rotateY(30deg)';
            gateLock.style.animation = 'none';
            
            setTimeout(() => {
                gateLeft.style.transform = 'rotateY(0deg)';
                gateRight.style.transform = 'rotateY(0deg)';
            }, 1000);
        }, 500);
    } else if (screenIndex === 4) {
        // Proposal screen - start heart animation
        const hearts = document.querySelectorAll('.heart');
        hearts.forEach(heart => {
            heart.style.opacity = '1';
        });
    } else if (screenIndex === 5) {
        // Yes screen - start confetti
        const confetti = document.querySelectorAll('.confetti');
        confetti.forEach((piece, index) => {
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.animationDelay = `${index * 0.5}s`;
        });
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Click to proceed from opening screen
    document.getElementById('opening-screen').addEventListener('click', () => {
        if (currentScreen === 0) {
            showScreen(1);
        }
    });
    
    // Click to proceed from garden screen
    document.getElementById('garden-screen').addEventListener('click', () => {
        if (currentScreen === 1) {
            showScreen(2);
        }
    });
    
    // Path selection
    document.querySelectorAll('.path-choice').forEach(choice => {
        choice.addEventListener('click', () => {
            chosenPath = choice.getAttribute('data-path');
            
            // Visual feedback for selection
            document.querySelectorAll('.path-choice').forEach(c => {
                c.style.transform = 'scale(0.95)';
                c.style.opacity = '0.5';
            });
            
            choice.style.transform = 'scale(1.1)';
            choice.style.opacity = '1';
            
            // Show path-specific message
            const pathMessages = {
                '1': 'You chose the path of roses... A romantic choice!',
                '2': 'You chose the path of fairy lights... A magical choice!',
                '3': 'You chose the path of moonlight... A mysterious choice!'
            };
            
            // Show message and proceed
            setTimeout(() => {
                showScreen(3);
            }, 1500);
        });
    });
    
    // Riddle answer submission
    submitAnswer.addEventListener('click', checkRiddleAnswer);
    riddleAnswer.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkRiddleAnswer();
        }
    });
    
    // Proposal responses
    yesBtn.addEventListener('click', () => {
        // Create a burst of hearts
        createHeartBurst();
        // Play celebration sound
        playCelebrationSound();
        // Show yes screen after delay
        setTimeout(() => {
            showScreen(5);
        }, 1500);
    });
    
    noBtn.addEventListener('click', () => {
        // Show no screen
        showScreen(6);
    });
    
    // Restart buttons
    restartBtn.addEventListener('click', restartExperience);
    restartNoBtn.addEventListener('click', restartExperience);
    
    // Music toggle
    musicToggle.addEventListener('click', toggleMusic);
    
    // Add hover sound effects to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            playHoverSound();
        });
    });
}

// Check riddle answer
function checkRiddleAnswer() {
    const answer = riddleAnswer.value.trim().toLowerCase();
    const correctAnswers = ['love', 'valentine', 'romance', 'affection', 'adore'];
    
    feedback.classList.remove('hidden');
    
    if (correctAnswers.includes(answer)) {
        feedback.innerHTML = '<p style="color: #4CAF50;">Correct! The gate swings open...</p>';
        feedback.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
        
        // Animate gate opening
        const gateLeft = document.querySelector('.gate-left');
        const gateRight = document.querySelector('.gate-right');
        const gateLock = document.querySelector('.gate-lock');
        
        gateLock.innerHTML = '<i class="fas fa-unlock"></i>';
        gateLock.style.color = '#4CAF50';
        
        setTimeout(() => {
            gateLeft.style.transition = 'transform 2s';
            gateRight.style.transition = 'transform 2s';
            gateLeft.style.transform = 'rotateY(-60deg)';
            gateRight.style.transform = 'rotateY(60deg)';
            
            // Proceed to proposal screen
            setTimeout(() => {
                showScreen(4);
            }, 2000);
        }, 1000);
    } else {
        feedback.innerHTML = '<p style="color: #ff6b6b;">Not quite... Try thinking about what Valentine\'s Day represents.</p>';
        feedback.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
        
        // Shake animation for wrong answer
        riddleAnswer.style.animation = 'shake 0.5s';
        setTimeout(() => {
            riddleAnswer.style.animation = '';
        }, 500);
    }
}

// Create heart burst animation
function createHeartBurst() {
    const proposalScreen = document.getElementById('proposal-screen');
    
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        heart.style.position = 'absolute';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.fontSize = Math.random() * 30 + 20 + 'px';
        heart.style.color = ['#e63946', '#ff6b8b', '#ffd700'][Math.floor(Math.random() * 3)];
        heart.style.opacity = '0';
        heart.style.zIndex = '1000';
        heart.style.pointerEvents = 'none';
        
        proposalScreen.appendChild(heart);
        
        // Animate heart
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 200 + 100;
        const duration = Math.random() * 1 + 1;
        
        const animation = heart.animate([
            { 
                transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
                opacity: 1
            },
            { 
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1) rotate(${Math.random() * 360}deg)`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        // Remove heart after animation
        animation.onfinish = () => {
            heart.remove();
        };
    }
}

// Play celebration sound
function playCelebrationSound() {
    if (!musicEnabled) return;
    
    const celebrationSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-happy-crowd-laugh-464.mp3');
    celebrationSound.volume = 0.5;
    celebrationSound.play().catch(e => console.log("Sound play prevented:", e));
}

// Play hover sound
function playHoverSound() {
    if (!musicEnabled) return;
    
    const hoverSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3');
    hoverSound.volume = 0.2;
    hoverSound.play().catch(e => console.log("Hover sound prevented:", e));
}

// Toggle background music
function toggleMusic() {
    musicEnabled = !musicEnabled;
    const icon = musicToggle.querySelector('i');
    
    if (musicEnabled) {
        bgMusic.play().catch(e => console.log("Play prevented:", e));
        icon.className = 'fas fa-volume-up';
        musicToggle.style.borderColor = '#e63946';
    } else {
        bgMusic.pause();
        icon.className = 'fas fa-volume-mute';
        musicToggle.style.borderColor = '#666';
    }
}

// Restart the experience
function restartExperience() {
    // Reset game state
    chosenPath = null;
    riddleAnswer.value = '';
    feedback.classList.add('hidden');
    
    // Reset envelope
    const envelopeFlap = document.querySelector('.envelope-flap');
    const letter = document.querySelector('.letter');
    envelopeFlap.style.transform = 'rotateX(0deg)';
    letter.style.transform = 'translateY(20px)';
    
    // Reset gate
    const gateLeft = document.querySelector('.gate-left');
    const gateRight = document.querySelector('.gate-right');
    const gateLock = document.querySelector('.gate-lock');
    
    if (gateLeft && gateRight && gateLock) {
        gateLeft.style.transform = 'rotateY(0deg)';
        gateRight.style.transform = 'rotateY(0deg)';
        gateLock.innerHTML = '<i class="fas fa-lock"></i>';
        gateLock.style.color = '#ffd700';
        gateLock.style.animation = 'lockShake 3s infinite';
    }
    
    // Reset path choices
    document.querySelectorAll('.path-choice').forEach(choice => {
        choice.style.transform = '';
        choice.style.opacity = '';
    });
    
    // Go back to opening screen
    showScreen(0);
}

// Add CSS for shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);