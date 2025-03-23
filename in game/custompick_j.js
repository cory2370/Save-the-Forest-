document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const presetEasy = document.getElementById('presetEasy');
    const presetMedium = document.getElementById('presetMedium');
    const presetHard = document.getElementById('presetHard');
    const presetExtreme = document.getElementById('presetExtreme');
    
    presetEasy.addEventListener('click', function() {
        body.setAttribute('data-theme', 'easy');
    });
    
    presetMedium.addEventListener('click', function() {
        body.setAttribute('data-theme', 'medium');
    });
    
    presetHard.addEventListener('click', function() {
        body.setAttribute('data-theme', 'hard');
    });
    
    presetExtreme.addEventListener('click', function() {
        body.setAttribute('data-theme', 'extreme');
    });
});
