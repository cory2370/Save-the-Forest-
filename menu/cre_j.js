document.addEventListener('DOMContentLoaded', function() {
    const boxes = document.querySelectorAll('.credits-box');
    
    document.querySelectorAll('.progress').forEach(progressBar => {
        const width = progressBar.style.width;
        progressBar.style.setProperty('--fill-width', width);
    });
    
    boxes.forEach(box => {
        box.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const infoElement = document.getElementById(targetId);
            const expandIcon = this.querySelector('.expand-icon');
            
            this.classList.toggle('active');
            
            if (infoElement.classList.contains('show')) {
                infoElement.classList.remove('show');
                expandIcon.textContent = '▼';
                
                infoElement.style.maxHeight = '0px';
                setTimeout(() => {
                    infoElement.style.display = 'none';
                }, 300);
            } else {
                document.querySelectorAll('.credits-info.show').forEach(el => {
                    el.classList.remove('show');
                    el.style.maxHeight = '0px';
                    setTimeout(() => {
                        el.style.display = 'none';
                    }, 300);
                    
                    const boxId = el.getAttribute('id');
                    const relatedBox = document.querySelector(`.credits-box[data-target="${boxId}"]`);
                    if (relatedBox) {
                        relatedBox.classList.remove('active');
                        relatedBox.querySelector('.expand-icon').textContent = '▼';
                    }
                });
                
                infoElement.classList.add('show');
                infoElement.style.display = 'block';
                expandIcon.textContent = '▲';
                
                infoElement.querySelectorAll('.progress').forEach(progressBar => {
                    const originalWidth = progressBar.style.width;
                    progressBar.style.setProperty('--fill-width', originalWidth);
                    progressBar.style.width = '0';
                    
                    progressBar.offsetWidth;
                    
                    setTimeout(() => {
                        progressBar.style.width = originalWidth;
                    }, 50);
                });
                
                setTimeout(() => {
                    infoElement.style.maxHeight = infoElement.scrollHeight + 'px';
                }, 10);
            }
        });
    });
});
