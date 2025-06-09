const express = require('express');
const router = express.Router();
const dbConn = require('../../lib/db');

// Página principal: mostrar libros disponibles para comprar o prestar, agrupados por categoría
router.get('/', (req, res, next) => {
    // Consulta para obtener libros con autores, categorías y disponibilidad
    const sql = `
        SELECT 
            b.id_book,
            b.name AS book_name,
            b.isbn,  -- <== Aquí agregamos el isbn
            b.cover_image,
            b.year_published,
            b.total_quantity,
            b.state,
            p.name AS publisher_name,
            GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') AS authors,
            GROUP_CONCAT(DISTINCT c.name SEPARATOR ', ') AS categories
        FROM books b
        LEFT JOIN book_authors ba ON b.id_book = ba.id_book
        LEFT JOIN authors a ON ba.id_author = a.id_author
        LEFT JOIN book_categories bc ON b.id_book = bc.id_book
        LEFT JOIN categories c ON bc.id_category = c.id_category
        LEFT JOIN publishers p ON b.id_publisher = p.id_publisher
        WHERE b.state = 1
        GROUP BY b.id_book
        ORDER BY b.name ASC`;

    dbConn.query(sql, (err, books) => {
        if (err) return next(err);

        const booksByCategory = {};
        const allBooksByCategory = {};

        books.forEach(book => {
            // Limpiar ISBN para formato correcto
            let cleanIsbn = book.isbn ? String(book.isbn).replace(/[^0-9Xx]/g, '') : null;
            let isValidIsbn = cleanIsbn && (cleanIsbn.length === 10 || cleanIsbn.length === 13);
            let fallbackCover = book.cover_image ? ('/uploads/covers/' + book.cover_image) : '/uploads/covers/no_cover_available.png';
            let coverUrl = isValidIsbn
                ? `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`
                : fallbackCover;
            book.cleanIsbn = cleanIsbn;
            book.fallbackCover = fallbackCover;
            book.coverUrl = coverUrl;
            book.authorsArr = book.authors ? book.authors.split(', ') : [];
            book.categoriesArr = book.categories ? book.categories.split(', ') : [];
            let mainCategory = book.categoriesArr.length > 0 ? book.categoriesArr[0] : 'Sin categoría';
            if (!allBooksByCategory[mainCategory]) allBooksByCategory[mainCategory] = [];
            allBooksByCategory[mainCategory].push(book);
        });

        // Seleccionar 6 libros aleatorios por categoría
        Object.keys(allBooksByCategory).forEach(category => {
            let booksArr = allBooksByCategory[category];
            let shuffled = booksArr.sort(() => 0.5 - Math.random());
            booksByCategory[category] = shuffled.slice(0, 6);
        });

        res.render('main/books', {
            titleWeb: 'Catálogo de Libros',
            booksByCategory,
            allBooksByCategory // Para el botón "Ver todos"
        });
    });
});

module.exports = router;
