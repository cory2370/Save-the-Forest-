document.addEventListener('DOMContentLoaded', function() {
    const gameGrid = document.getElementById('gameGrid');
    const countdownOverlay = document.getElementById('countdownOverlay');
    const readySection = document.getElementById('readySection');
    const countdownSection = document.getElementById('countdownSection');
    
    if (gameGrid && countdownOverlay) {
        gameGrid.style.position = 'relative';
        
        countdownOverlay.style.position = 'absolute';
        countdownOverlay.style.top = '0';
        countdownOverlay.style.left = '0';
        countdownOverlay.style.width = '100%';
        countdownOverlay.style.height = '100%';
        countdownOverlay.style.pointerEvents = 'auto';
        countdownOverlay.style.margin = '0';
        
        gameGrid.appendChild(countdownOverlay);
    }
    
    const readyButton = document.getElementById('readyButton');
    if (readyButton) {
        readyButton.addEventListener('click', function() {
            readySection.style.display = 'none';
            countdownSection.style.display = 'flex';
            
            let countdown = 3;
            const countdownTimer = document.getElementById('countdownTimer');
            countdownTimer.textContent = countdown;
            
            const timer = setInterval(function() {
                countdown--;
                countdownTimer.textContent = countdown;
                
                if (countdown <= 0) {
                    clearInterval(timer);
                    countdownOverlay.style.display = 'none';
                    
                    if (typeof window.startGameFunction === 'function') {
                        window.startGameFunction();
                    }
                }
            }, 1000);
        });
    }
});
