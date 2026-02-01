// DOM Elements
const screens = document.querySelectorAll('.screen');
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
const restartButton = document.getElementById('restart-button');
const nextStoryButton = document.getElementById('next-story');

// Game State
let currentScreen = 0;
let chosenPath = null;
let musicEnabled = true;
let storyStep = 0;
let kissProgress = 0;
let kissInterval = null;

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
                console.log("Autoplay prevented, user needs to interact first");
            });
        }
    }, 1000);
    
    // Detect mobile device
    if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.body.classList.add('mobile');
    }
    
    // Generate flowers for garden
    generateFlowers();
});

// Show specific screen
function showScreen(screenIndex) {
    screens.forEach(screen => screen.classList.remove('active'));
    screens[screenIndex].classList.add('active');
    currentScreen = screenIndex;
    
    // Special animations for specific screens
    switch(screenIndex) {
        case 0: // Opening screen
            animateEnvelope();
            break;
        case 1: // Garden screen
            generateFlowers();
            break;
        case 2: // Path choice screen
            // Reset story step
            storyStep = 0;
            break;
        case 3: // Story screen
            loadStory();
            break;
        case 4: // Puzzle screen
            setupPuzzle();
            break;
        case 5: // Proposal screen
            setupProposal();
            break;
        case 6: // Celebration screen
            startCelebration();
            break;
    }
}

// Animate envelope opening
function animateEnvelope() {
    setTimeout(() => {
        const envelopeTop = document.querySelector('.envelope-top');
        const letter = document.querySelector('.letter');
        
        envelopeTop.style.transform = 'rotateX(180deg)';
        letter.style.transform = 'translateY(0)';
        
        // Add sparkle effect
        envelopeTop.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        letter.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    }, 500);
}

// Generate random flowers for garden
function generateFlowers() {
    const flowersContainer = document.querySelector('.flowers-everywhere');
    if (!flowersContainer) return;
    
    flowersContainer.innerHTML = '';
    
    const flowerTypes = ['🌸', '🌷', '🌺', '💮', '🏵️', '🌻', '🌼', '🌹'];
    const numFlowers = window.innerWidth < 768 ? 15 : 30;
    
    for (let i = 0; i < numFlowers; i++) {
        const flower = document.createElement('div');
        flower.className = 'flower';
        flower.innerHTML = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
        
        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = 20 + Math.random() * 30;
        const rotation = Math.random() * 360;
        const delay = Math.random() * 5;
        
        flower.style.position = 'absolute';
        flower.style.left = `${left}%`;
        flower.style.top = `${top}%`;
        flower.style.fontSize = `${size}px`;
        flower.style.transform = `rotate(${rotation}deg)`;
        flower.style.animationDelay = `${delay}s`;
        flower.style.animation = `flowerWiggle ${3 + Math.random() * 4}s infinite ease-in-out`;
        flower.style.zIndex = '1';
        flower.style.pointerEvents = 'none';
        
        flowersContainer.appendChild(flower);
    }
}

// Setup event listeners
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
            choice.style.boxShadow = '0 20px 40px rgba(255, 102, 153, 0.6)';
            
            // Play selection sound
            playSound('select');
            
            // Show story after delay
            setTimeout(() => {
                showScreen(3);
            }, 1000);
        });
    });
    
    // Next story button
    if (nextStoryButton) {
        nextStoryButton.addEventListener('click', () => {
            storyStep++;
            loadStory();
        });
    }
    
    // Restart button
    if (restartButton) {
        restartButton.addEventListener('click', restartExperience);
    }
    
    // Music toggle
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
    
    // Add tap sounds to buttons
    document.querySelectorAll('.cute-button, .share-btn, .puzzle-option').forEach(button => {
        button.addEventListener('click', () => {
            playSound('tap');
        });
        
        button.addEventListener('mouseenter', () => {
            if (!document.body.classList.contains('mobile')) {
                playSound('hover');
            }
        });
    });
}

// Load story based on chosen path
function loadStory() {
    const storyContent = document.getElementById('story-content');
    if (!storyContent) return;
    
    const stories = {
        '1': [ // Carnival Date story
            {
                title: "🎠 Carnival Fun! 🎠",
                content: `
                    <p>We arrive at the most colorful carnival ever! 🌈</p>
                    <p>The air smells like cotton candy and popcorn! 🍿</p>
                    <div class="story-highlight">First stop: The Ferris Wheel! 🎡</div>
                    <p>We ride to the top and see the whole sparkling carnival below!</p>
                `
            },
            {
                title: "🎯 Game Time! 🎯",
                content: `
                    <p>You win me a giant pink teddy bear! 🧸</p>
                    <p>I try to win you a prize but... I'm not very good at games! 😅</p>
                    <div class="story-highlight">You laugh and help me win a cute heart plushie! 💖</div>
                    <p>We share cotton candy as we walk around! 🍭</p>
                `
            },
            {
                title: "💫 Magical Moments 💫",
                content: `
                    <p>The carnival lights start twinkling like stars! ✨</p>
                    <p>We ride the carousel together, laughing like kids! 🎠</div>
                    <div class="story-highlight">At the photo booth, we take silly pictures with heart frames! 📸</div>
                    <p>You win me one more prize - a keychain that says "My Valentine"! 🔑</p>
                    <p class="story-ending">Best. Carnival. Ever. 🎉</p>
                `
            }
        ],
        '2': [ // Starlight Picnic story
            {
                title: "🌙 Evening Magic 🌙",
                content: `
                    <p>We find the perfect spot on a soft blanket under the stars! ⭐</p>
                    <p>You brought all my favorite snacks! 🍓🍫</p>
                    <div class="story-highlight">Fairy lights twinkle around us like fireflies! ✨</div>
                    <p>The air is warm and smells like night-blooming flowers! 🌺</p>
                `
            },
            {
                title: "🎶 Sweet Conversations 🎶",
                content: `
                    <p>We share stories and laugh under the moonlight! 🌕</p>
                    <p>Soft music plays from a little speaker you brought! 🎵</div>
                    <div class="story-highlight">We spot shooting stars and make wishes together! 🌠</div>
                    <p>You point out constellations and tell me their stories! 🌌</p>
                `
            },
            {
                title: "💖 Heartfelt Moments 💖",
                content: `
                    <p>We share chocolate-covered strawberries! 🍓</p>
                    <p>The stars seem extra bright tonight, just like your smile! 😊</p>
                    <div class="story-highlight">Wrapped in a cozy blanket, we watch the night sky together! 🛌</div>
                    <p>This perfect moment feels like it could last forever... ❤️</p>
                    <p class="story-ending">A night to remember always! 🌟</p>
                `
            }
        ],
        '3': [ // Art Adventure story
            {
                title: "🎨 Creative Fun! 🎨",
                content: `
                    <p>Welcome to our art studio! Paintbrushes and colors everywhere! 🖌️</p>
                    <p>You choose pink and purple paints - my favorites! 💜💗</p>
                    <div class="story-highlight">We wear matching aprons that say "Artist in Love"! 👩‍🎨👨‍🎨</div>
                    <p>Soft music plays as we prepare our canvases! 🎵</p>
                `
            },
            {
                title: "🌈 Painting Together 🌈",
                content: `
                    <p>We paint each other's portraits - with extra sparkles! ✨</p>
                    <p>There's paint on our noses and laughter in the air! 😄</p>
                    <div class="story-highlight">You help me fix my painting when I make a "happy accident"! 🎨</div>
                    <p>We create a joint painting of hearts and rainbows! 🌈💕</p>
                `
            },
            {
                title: "💕 Masterpiece Memories 💕",
                content: `
                    <p>Our finished paintings are proudly displayed! 🖼️</p>
                    <p>Yours shows us holding hands under a rainbow! 👫🌈</p>
                    <div class="story-highlight">Mine shows us with heart-shaped balloons flying up to the stars! 🎈⭐</div>
                    <p>We sign our paintings with "Forever Valentines" at the bottom! 💌</p>
                    <p class="story-ending">Creating memories with every brushstroke! 🎨❤️</p>
                `
            }
        ]
    };
    
    const currentStory = stories[chosenPath];
    
    if (!currentStory || storyStep >= currentStory.length) {
        // Story complete, go to puzzle
        showScreen(4);
        return;
    }
    
    const storyPart = currentStory[storyStep];
    storyContent.innerHTML = `
        <h3>${storyPart.title}</h3>
        ${storyPart.content}
        <div class="story-emoji">${getStoryEmoji(chosenPath, storyStep)}</div>
    `;
    
    // Update button text for last part
    if (storyStep === currentStory.length - 1) {
        nextStoryButton.innerHTML = 'Continue to Puzzle! <i class="fas fa-arrow-right"></i>';
    } else {
        nextStoryButton.innerHTML = 'Next Part <i class="fas fa-arrow-right"></i>';
    }
}

// Get emoji for story
function getStoryEmoji(path, step) {
    const emojis = {
        '1': ['🎡', '🎯', '💫'],
        '2': ['🌙', '🎶', '💖'],
        '3': ['🎨', '🌈', '💕']
    };
    return emojis[path][step] || '✨';
}

// Setup puzzle game
function setupPuzzle() {
    const puzzleOptions = document.querySelectorAll('.puzzle-option');
    const puzzleMessage = document.getElementById('puzzle-message');
    
    puzzleOptions.forEach(option => {
        option.addEventListener('click', () => {
            const answer = option.getAttribute('data-answer');
            
            // Visual feedback
            puzzleOptions.forEach(opt => {
                opt.style.transform = 'scale(0.95)';
                opt.style.opacity = '0.5';
            });
            
            option.style.transform = 'scale(1.1)';
            option.style.opacity = '1';
            option.style.boxShadow = '0 0 30px rgba(255, 102, 153, 0.8)';
            
            // Play sound
            playSound(answer === 'love' ? 'correct' : 'wrong');
            
            if (answer === 'love') {
                option.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
                puzzleMessage.innerHTML = '🎉 Correct! LOVE is the answer! 💖';
                puzzleMessage.style.color = '#4CAF50';
                
                // Animate lock opening
                const lock = document.querySelector('.lock-body');
                lock.style.animation = 'none';
                lock.innerHTML = '🔓';
                lock.style.transform = 'rotate(45deg)';
                lock.style.transition = 'transform 0.5s';
                
                // Proceed to proposal after delay
                setTimeout(() => {
                    showScreen(5);
                }, 1500);
            } else {
                option.style.background = 'linear-gradient(135deg, #ff6666 0%, #cc3333 100%)';
                puzzleMessage.innerHTML = '💖 Try again! Think about what fills my heart! 💭';
                puzzleMessage.style.color = '#ff6666';
                
                // Reset after delay
                setTimeout(() => {
                    puzzleOptions.forEach(opt => {
                        opt.style.transform = '';
                        opt.style.opacity = '';
                        opt.style.background = 'linear-gradient(135deg, #ffb3d9 0%, #ff99cc 100%)';
                        opt.style.boxShadow = '0 5px 15px rgba(255, 102, 153, 0.3)';
                    });
                    puzzleMessage.innerHTML = 'Choose the correct answer! 🌸';
                    puzzleMessage.style.color = '#ff6699';
                }, 1000);
            }
        });
    });
}

// Setup proposal interaction
function setupProposal() {
    const dancingHearts = document.querySelectorAll('.dancing-heart');
    const kissMeterFill = document.querySelector('.meter-fill');
    const kissStatus = document.querySelector('.kiss-status');
    
    // Reset kiss progress
    kissProgress = 0;
    if (kissInterval) clearInterval(kissInterval);
    
    // Dancing hearts click/tap
    dancingHearts.forEach(heart => {
        heart.addEventListener('click', () => {
            heart.style.animation = 'none';
            heart.style.transform = 'scale(1.5) rotate(360deg)';
            heart.style.transition = 'transform 0.5s';
            
            // Play happy sound
            playSound('heart');
            
            // Celebrate after delay
            setTimeout(() => {
                celebrateYes();
            }, 800);
        });
        
        // Mobile touch feedback
        heart.addEventListener('touchstart', () => {
            heart.style.transform = 'scale(1.3)';
        });
        
        heart.addEventListener('touchend', () => {
            heart.style.transform = 'scale(1)';
        });
    });
    
    // Kiss detection (simulated for fun)
    let isDetectingKiss = false;
    const kissDetector = document.querySelector('.kiss-detector');
    
    kissDetector.addEventListener('click', startKissDetection);
    kissDetector.addEventListener('touchstart', startKissDetection);
    
    function startKissDetection() {
        if (isDetectingKiss) return;
        
        isDetectingKiss = true;
        kissStatus.textContent = 'Listening for your kiss... 😘';
        
        // Simulate kiss detection with progress bar
        kissInterval = setInterval(() => {
            kissProgress += 5 + Math.random() * 15;
            
            if (kissProgress > 100) {
                kissProgress = 100;
                clearInterval(kissInterval);
                
                // Kiss detected!
                kissStatus.textContent = 'Kiss detected! 💋💖';
                playSound('kiss');
                
                // Animate kiss icon
                const kissIcon = document.querySelector('.kiss-icon');
                kissIcon.style.animation = 'none';
                kissIcon.style.transform = 'scale(1.5)';
                kissIcon.innerHTML = '💖';
                
                // Celebrate after delay
                setTimeout(() => {
                    celebrateYes();
                }, 1000);
            }
            
            kissMeterFill.style.width = `${kissProgress}%`;
        }, 200);
        
        // Stop detection after 5 seconds
        setTimeout(() => {
            if (isDetectingKiss) {
                clearInterval(kissInterval);
                kissStatus.textContent = 'Try blowing on your screen! 💨';
                kissMeterFill.style.width = '0%';
                kissProgress = 0;
                isDetectingKiss = false;
            }
        }, 5000);
    }
    
    // Add confetti
    generateConfetti();
}

// Generate floating confetti
function generateConfetti() {
    const confettiContainer = document.querySelector('.floating-confetti');
    if (!confettiContainer) return;
    
    confettiContainer.innerHTML = '';
    
    const confettiTypes = ['💖', '💗', '💓', '💕', '💞', '✨', '🌟', '⭐'];
    const numConfetti = window.innerWidth < 768 ? 20 : 40;
    
    for (let i = 0; i < numConfetti; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.innerHTML = confettiTypes[Math.floor(Math.random() * confettiTypes.length)];
        
        // Random properties
        const left = Math.random() * 100;
        const size = 20 + Math.random() * 25;
        const duration = 3 + Math.random() * 4;
        const delay = Math.random() * 5;
        const color = getRandomColor();
        
        confetti.style.position = 'absolute';
        confetti.style.left = `${left}%`;
        confetti.style.fontSize = `${size}px`;
        confetti.style.color = color;
        confetti.style.opacity = '0';
        confetti.style.zIndex = '1';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = `confettiFall ${duration}s ${delay}s infinite linear`;
        
        confettiContainer.appendChild(confetti);
    }
}

// Get random pastel color
function getRandomColor() {
    const colors = [
        '#ffb3cc', '#ff99bb', '#ff80b3', '#ff66a3',
        '#ffb3d9', '#ff99cc', '#ff80bf', '#ff66b2',
        '#ffccdd', '#ffb3c6', '#ff99b3', '#ff80a0'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Celebrate YES response
function celebrateYes() {
    // Play celebration sound
    playSound('celebration');
    
    // Add more confetti
    generateConfetti();
    
    // Show celebration screen after delay
    setTimeout(() => {
        showScreen(6);
    }, 1000);
}

// Start celebration animation
function startCelebration() {
    // Generate balloons
    const balloonsContainer = document.querySelector('.floating-balloons');
    if (balloonsContainer) {
        balloonsContainer.innerHTML = '';
        
        for (let i = 0; i < 5; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.innerHTML = '🎈';
            
            const left = 10 + (i * 20);
            const delay = i * 0.5;
            
            balloon.style.position = 'absolute';
            balloon.style.left = `${left}%`;
            balloon.style.bottom = '0px';
            balloon.style.fontSize = '40px';
            balloon.style.animation = `balloonFloat 5s ${delay}s infinite ease-in-out`;
            
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

// Play sounds
function playSound(type) {
    if (!musicEnabled) return;
    
    const sounds = {
        'tap': 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3',
        'hover': 'https://assets.mixkit.co/sfx/preview/mixkit-bubble-pop-up-3000.mp3',
        'select': 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3',
        'correct': 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
        'wrong': 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3',
        'heart': 'https://assets.mixkit.co/sfx/preview/mixkit-heartbeat-love-901.mp3',
        'kiss': 'https://assets.mixkit.co/sfx/preview/mixkit-cartoon-kiss-3056.mp3',
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
            console.log("Music play prevented, user needs to interact");
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
    chosenPath = null;
    storyStep = 0;
    kissProgress = 0;
    
    if (kissInterval) {
        clearInterval(kissInterval);
        kissInterval = null;
    }
    
    // Reset envelope
    const envelopeTop = document.querySelector('.envelope-top');
    const letter = document.querySelector('.letter');
    
    if (envelopeTop && letter) {
        envelopeTop.style.transform = 'rotateX(0deg)';
        letter.style.transform = 'translateY(15px)';
    }
    
    // Reset path choices
    document.querySelectorAll('.path-choice').forEach(choice => {
        choice.style.transform = '';
        choice.style.opacity = '';
        choice.style.boxShadow = '';
    });
    
    // Reset puzzle
    const lock = document.querySelector('.lock-body');
    if (lock) {
        lock.style.animation = 'lockBounce 2s infinite';
        lock.innerHTML = '🔒';
        lock.style.transform = 'rotate(0deg)';
    }
    
    // Reset proposal screen
    const dancingHearts = document.querySelectorAll('.dancing-heart');
    dancingHearts.forEach(heart => {
        heart.style.animation = '';
        heart.style.transform = '';
        heart.style.transition = '';
        heart.innerHTML = heart.getAttribute('data-choice') === 'yes' ? '💖' : '💗';
    });
    
    const kissIcon = document.querySelector('.kiss-icon');
    if (kissIcon) {
        kissIcon.style.animation = 'kissFloat 3s infinite';
        kissIcon.style.transform = '';
        kissIcon.innerHTML = '💋';
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
    screenshotMsg.innerHTML = '📸 Screenshot saved in your heart! 💖';
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
    @keyframes flowerWiggle {
        0%, 100% { transform: rotate(0deg) scale(1); }
        25% { transform: rotate(5deg) scale(1.1); }
        75% { transform: rotate(-5deg) scale(1.1); }
    }
    
    @keyframes confettiFall {
        0% { 
            transform: translateY(-100px) rotate(0deg) scale(0.5); 
            opacity: 0; 
        }
        10% { 
            opacity: 1; 
        }
        90% { 
            opacity: 1; 
        }
        100% { 
            transform: translateY(100vh) rotate(360deg) scale(1.2); 
            opacity: 0; 
        }
    }
    
    .story-emoji {
        font-size: 50px;
        margin-top: 20px;
        animation: bounce 1s infinite;
    }
    
    .story-ending {
        color: #ff3366;
        font-weight: 900;
        font-size: 20px;
        margin-top: 20px;
        animation: pulse 2s infinite;
    }
    
    .mobile .dancing-heart:active {
        transform: scale(1.3) !important;
    }
    
    /* Responsive improvements */
    @media (max-width: 480px) {
        .response-instruction {
            padding: 15px;
        }
        
        .response-instruction p {
            font-size: 16px;
        }
        
        .fun-instruction {
            font-size: 18px !important;
        }
        
        .kiss-detector {
            padding: 20px;
        }
        
        .kiss-icon {
            font-size: 50px;
        }
        
        .kiss-hint {
            font-size: 16px;
        }
    }
`;
document.head.appendChild(style);

// Handle window resize
window.addEventListener('resize', () => {
    if (currentScreen === 1) {
        generateFlowers();
    }
    if (currentScreen === 5) {
        generateConfetti();
    }
});

// Prevent right-click context menu
document.addEventListener('contextmenu', (e) => {
    if (currentScreen === 5 || currentScreen === 6) {
        e.preventDefault();
    }
});
