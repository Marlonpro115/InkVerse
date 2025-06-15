const express = require('express');
const router = express.Router();
const dbConn = require('../../lib/db');
const upload = require('../../middlewares/upload');
const fs = require('fs');
const path = require('path');

// Middleware para mensajes flash
function setFlash(req, res, next) {
  res.locals.success = req.session.success;
  res.locals.error = req.session.error;
  delete req.session.success;
  delete req.session.error;
  next();
}

router.use(setFlash);

// display books page con mensajes de feedback
router.get('/', async function (req, res, next) {
  try {
    const [books] = await dbConn.promise().query(`
      SELECT 
        b.id_book, b.name, b.isbn, b.year_published, b.num_pages, b.cover_image, b.total_quantity, b.created_at, b.state,
        p.name AS publisher,
        GROUP_CONCAT(a.name SEPARATOR ', ') AS authors
      FROM books b
      LEFT JOIN publishers p ON b.id_publisher = p.id_publisher
      LEFT JOIN book_authors ba ON b.id_book = ba.id_book
      LEFT JOIN authors a ON ba.id_author = a.id_author
      WHERE b.deleted_at IS NULL
      GROUP BY b.id_book
      ORDER BY b.created_at DESC
    `);
    res.render('dashboard/books', {
      books,
      success: res.locals.success,
      error: res.locals.error
    });
  } catch (err) {
    res.render('dashboard/books', { books: [], error: err.message });
  }
});

// Crear libro desde el formulario modal
router.post('/add', async function (req, res) {
  try {
    const { name, isbn, year_published, num_pages, total_quantity, publisher, state } = req.body;
    // Buscar o crear editorial
    let id_publisher = null;
    if (publisher) {
      const [pubRows] = await dbConn.promise().query('SELECT id_publisher FROM publishers WHERE name = ?', [publisher]);
      if (pubRows.length) {
        id_publisher = pubRows[0].id_publisher;
      } else {
        const [result] = await dbConn.promise().query('INSERT INTO publishers (name) VALUES (?)', [publisher]);
        id_publisher = result.insertId;
      }
    }
    // Insertar libro
    await dbConn.promise().query(
      `INSERT INTO books (name, isbn, year_published, num_pages, total_quantity, id_publisher, state) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, isbn, year_published, num_pages, total_quantity, id_publisher, state === 'Activo' ? 1 : 0]
    );
    req.session.success = 'Libro añadido correctamente';
    res.redirect('/dashboard/books');
  } catch (err) {
    req.session.error = 'Error al añadir libro: ' + err.message;
    res.redirect('/dashboard/books');
  }
});

// Editar libro
router.post('/edit/:id_book', async function (req, res) {
  try {
    const { name, isbn, year_published, num_pages, total_quantity, publisher, state } = req.body;
    const { id_book } = req.params;
    // Buscar o crear editorial
    let id_publisher = null;
    if (publisher) {
      const [pubRows] = await dbConn.promise().query('SELECT id_publisher FROM publishers WHERE name = ?', [publisher]);
      if (pubRows.length) {
        id_publisher = pubRows[0].id_publisher;
      } else {
        const [result] = await dbConn.promise().query('INSERT INTO publishers (name) VALUES (?)', [publisher]);
        id_publisher = result.insertId;
      }
    }
    await dbConn.promise().query(
      `UPDATE books SET name=?, isbn=?, year_published=?, num_pages=?, total_quantity=?, id_publisher=?, state=? WHERE id_book=?`,
      [name, isbn, year_published, num_pages, total_quantity, id_publisher, state === 'Activo' ? 1 : 0, id_book]
    );
    req.session.success = 'Libro editado correctamente';
    res.redirect('/dashboard/books');
  } catch (err) {
    req.session.error = 'Error al editar libro: ' + err.message;
    res.redirect('/dashboard/books');
  }
});

// Eliminar libro (soft delete)
router.post('/delete/:id_book', async function (req, res) {
  try {
    const { id_book } = req.params;
    await dbConn.promise().query('UPDATE books SET deleted_at=NOW() WHERE id_book=?', [id_book]);
    req.session.success = 'Libro eliminado correctamente';
    res.redirect('/dashboard/books');
  } catch (err) {
    req.session.error = 'Error al eliminar libro: ' + err.message;
    res.redirect('/dashboard/books');
  }
});

// Ver libros eliminados
router.get('/deleted', async function (req, res) {
  try {
    const [books] = await dbConn.promise().query(`
      SELECT 
        b.id_book, b.name, b.isbn, b.year_published, b.num_pages, b.cover_image, b.total_quantity, b.created_at, b.state,
        p.name AS publisher,
        GROUP_CONCAT(a.name SEPARATOR ', ') AS authors,
        b.deleted_at
      FROM books b
      LEFT JOIN publishers p ON b.id_publisher = p.id_publisher
      LEFT JOIN book_authors ba ON b.id_book = ba.id_book
      LEFT JOIN authors a ON ba.id_author = a.id_author
      WHERE b.deleted_at IS NOT NULL
      GROUP BY b.id_book
      ORDER BY b.deleted_at DESC
    `);
    res.render('dashboard/books/books_deleted', {
      books,
      success: res.locals.success,
      error: res.locals.error
    });
  } catch (err) {
    res.render('dashboard/books/books_deleted', { books: [], error: err.message });
  }
});

// Restaurar libro eliminado
router.post('/restore/:id_book', async function (req, res) {
  try {
    const { id_book } = req.params;
    await dbConn.promise().query('UPDATE books SET deleted_at=NULL WHERE id_book=?', [id_book]);
    req.session.success = 'Libro restaurado correctamente';
    res.redirect('/dashboard/books/deleted');
  } catch (err) {
    req.session.error = 'Error al restaurar libro: ' + err.message;
    res.redirect('/dashboard/books/deleted');
  }
});

module.exports = router;