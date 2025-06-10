// Animación fade-in y bounce personalizada
document.querySelector('body').classList.add('transition-all', 'duration-700', 'opacity-0');
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelector('body').classList.remove('opacity-0');
        document.querySelector('body').classList.add('opacity-100');
    }, 100);
});