// Lógica para mostrar y ocultar el modal de información del libro
window.showBookModal = function(btn) {
  const book = JSON.parse(btn.getAttribute('data-book'));
  const modalBody = document.getElementById('book-modal-body');
  modalBody.innerHTML = `
    <div class="modal-flex">
      <img src="${book.coverUrl}" alt="Portada" class="modal-img">
      <div class="modal-info">
        <h2>${book.book_name}</h2>
        <p><span class="font-semibold text-cyan-300">Autor(es):</span> ${book.authorsArr.length ? book.authorsArr.join(', ') : 'Desconocido'}</p>
        <p><span class="font-semibold text-cyan-300">Categoría(s):</span> ${book.categoriesArr.length ? book.categoriesArr.join(', ') : 'Sin categoría'}</p>
        <p><span class="font-semibold text-cyan-300">Editorial:</span> ${book.publisher_name || 'Desconocida'}</p>
        <p><span class="font-semibold text-cyan-300">Año:</span> ${book.year_published || '-'}</p>
        <p><span class="font-semibold text-cyan-300">Disponibles:</span> ${book.total_quantity}</p>
        <div class="btn-row">
          <button class="book-btn prestar" ${book.total_quantity > 0 ? '' : 'disabled'}>Prestar</button>
          <button class="book-btn comprar">Comprar</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('book-modal').style.display = 'flex';
}
window.closeBookModal = function() {
  document.getElementById('book-modal').style.display = 'none';
}
