// Super Simple Version
document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    let currentScreen = 0;
    
    // Show first screen
    showScreen(0);
    
    // Animate envelope
    setTimeout(() => {
        document.querySelector('.envelope-top').style.transform = 'rotateX(180deg)';
        document.querySelector('.letter').style.transform = 'translateY(0)';
    }, 500);
    
    // Tap anywhere on opening screen -> date screen
    document.getElementById('opening-screen').addEventListener('click', () => {
        if (currentScreen === 0) {
            showScreen(1);
        }
    });
    
    // Tap anywhere on date screen -> proposal screen
    document.getElementById('date-screen').addEventListener('click', () => {
        if (currentScreen === 1) {
            showScreen(2);
        }
    });
    
    // Hearts in proposal screen
    document.querySelectorAll('.catch-heart').forEach(heart => {
        heart.addEventListener('click', () => {
            heart.classList.add('caught');
            const caught = document.querySelectorAll('.catch-heart.caught').length;
            document.getElementById('caught-count').textContent = caught;
            document.querySelector('.progress-fill').style.width = `${(caught/5)*100}%`;
            
            if (caught >= 5) {
                setTimeout(() => showScreen(3), 800);
            }
        });
    });
    
    // Restart button
    document.getElementById('restart-button')?.addEventListener('click', () => {
        currentScreen = 0;
        showScreen(0);
        document.querySelector('.envelope-top').style.transform = 'rotateX(0deg)';
        document.querySelector('.letter').style.transform = 'translateY(15px)';
    });
    
    // Show screen function
    function showScreen(index) {
        screens.forEach(s => s.classList.remove('active'));
        screens[index].classList.add('active');
        currentScreen = index;
    }
});
