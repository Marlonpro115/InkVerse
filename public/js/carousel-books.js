// Carrusel simple para las cards de libros
function moveCarousel(categoryId, direction) {
  const carousel = document.getElementById('carousel-' + categoryId);
  if (!carousel) return;
  const card = carousel.querySelector('.book-card');
  if (!card) return;
  const cardWidth = card.offsetWidth + 8; // 8px gap
  carousel.scrollBy({
    left: direction * cardWidth,
    behavior: 'smooth'
  });
}
