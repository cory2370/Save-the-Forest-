document.addEventListener('DOMContentLoaded', function() {
    const boxes = document.querySelectorAll('.difficulty-box');
    const container = document.getElementById('difficultyContainer');
    
    boxes.forEach((box, index) => {
        box.style.animation = `fadeIn ${0.5 + index * 0.2}s ease-in-out`;
        
        box.addEventListener('mouseenter', function() {
            const tooltipId = this.getAttribute('data-tooltip');
            const tooltip = document.getElementById(tooltipId);
            
            if (tooltip) {
                const boxRect = this.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                
                tooltip.style.top = (boxRect.top - containerRect.top + boxRect.height/2) + 'px';
                tooltip.style.left = (boxRect.right - containerRect.left + 20) + 'px';
                
                tooltip.classList.add('show');
            }
        });
        
        box.addEventListener('mouseleave', function() {
            const tooltipId = this.getAttribute('data-tooltip');
            const tooltip = document.getElementById(tooltipId);
            if (tooltip) {
                tooltip.classList.remove('show');
            }
        });
    });
});
