document.addEventListener('DOMContentLoaded', function() {
    const difficultyBoxes = document.querySelectorAll('.difficulty-box');
    const container = document.getElementById('difficultyContainer');
    const menuButtons = document.querySelectorAll('.menu-button');
    
    menuButtons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
            this.style.filter = 'brightness(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
            this.style.filter = '';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.filter = '';
        });
    });
    
    difficultyBoxes.forEach((box) => {
        box.addEventListener('mouseenter', function() {
            const tooltipId = this.getAttribute('data-tooltip');
            const tooltip = document.getElementById(tooltipId);
            
            if (tooltip) {
                if (window.innerWidth <= 768) {
                    tooltip.classList.add('show');
                } else {
                    const boxRect = this.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();
                    
                    tooltip.style.top = (boxRect.top - containerRect.top + boxRect.height/2) + 'px';
                    tooltip.style.left = (boxRect.right - containerRect.left + 20) + 'px';
                    
                    tooltip.classList.add('show');
                }
            }
        });
        
        box.addEventListener('mouseleave', function() {
            const tooltipId = this.getAttribute('data-tooltip');
            const tooltip = document.getElementById(tooltipId);
            
            if (tooltip) {
                tooltip.classList.remove('show');
            }
        });
        
        box.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        box.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    window.addEventListener('resize', function() {
        const activeTooltip = document.querySelector('.difficulty-tooltip.show');
        if (activeTooltip) {
            const box = document.querySelector(`[data-tooltip="${activeTooltip.id}"]`);
            if (box) {
                const event = new MouseEvent('mouseenter');
                box.dispatchEvent(event);
            }
        }
    });
    
    difficultyBoxes.forEach((box, index) => {
        setTimeout(() => {
            box.classList.add('highlight');
            setTimeout(() => {
                box.classList.remove('highlight');
            }, 300);
        }, 500 + (index * 100));
    });
});
