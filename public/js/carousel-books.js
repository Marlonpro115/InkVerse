// Carrusel con desplazamiento solo por botones
function moveCarousel(categoryId, direction) {
  const carousel = document.getElementById('carousel-' + categoryId);
  if (!carousel) return;
  const card = carousel.querySelector('.book-card');
  if (!card) return;
  const cardWidth = card.offsetWidth + 20; // 20px gap
  // Calcula el índice visible
  const visibleCards = Math.floor(carousel.offsetWidth / cardWidth);
  let currentIndex = Math.round(carousel.scrollLeft / cardWidth);
  let newIndex = currentIndex + direction;
  // Limita el índice para no pasarse
  newIndex = Math.max(0, Math.min(newIndex, carousel.children.length - visibleCards));
  const newScroll = newIndex * cardWidth;
  carousel.scrollTo({
    left: newScroll,
    behavior: 'smooth'
  });
}
// Evita el scroll manual con el mouse o touch
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.carousel').forEach(carousel => {
    carousel.addEventListener('wheel', e => e.preventDefault(), { passive: false });
    carousel.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
  });
});
