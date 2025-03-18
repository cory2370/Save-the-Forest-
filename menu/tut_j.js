document.addEventListener('DOMContentLoaded', function() {
    const menuButtons = document.querySelectorAll('.menu-button');
    menuButtons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.classList.add('button-active');
        });
        
        button.addEventListener('mouseup', function() {
            this.classList.remove('button-active');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('button-active');
        });
    });
    
    const tutorialSections = document.querySelectorAll('.tutorial-section');
    
    tutorialSections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
    });
    
    const controlItems = document.querySelectorAll('.control-item');
    controlItems.forEach(item => {
        const keys = item.querySelectorAll('.key');
        
        item.addEventListener('mouseenter', function() {
            keys.forEach(key => {
                key.style.transform = 'scale(1.1)';
            });
        });
        
        item.addEventListener('mouseleave', function() {
            keys.forEach(key => {
                key.style.transform = 'scale(1)';
            });
        });
    });
    
    const listItems = document.querySelectorAll('.section-content li');
    listItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-10px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 800 + (index * 150));
    });
});
