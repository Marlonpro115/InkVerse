const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../../lib/db');

// Mostrar formulario login
router.get('/login', (req, res) => {
    res.render('auth/login', { error: null, success: null });
});

// Procesar login
router.post('/login', (req, res) => {
    const { userIdentifier, password } = req.body;

    // Buscar por email o username
    const query = `SELECT u.*, up.profile_picture, up.profile_cover, up.about FROM users u LEFT JOIN user_profiles up ON u.id_user = up.user_id WHERE u.email = ? OR u.username = ?`;
    connection.query(query, [userIdentifier, userIdentifier], async (err, results) => {
        if (err) {
            return res.render('auth/login', { error: 'Error en el servidor' });
        }
        if (results.length === 0) {
            return res.render('auth/login', { error: 'Usuario no encontrado' });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.render('auth/login', { error: 'Contraseña incorrecta' });
        }

        // Elimina la contraseña antes de guardar en sesión
        delete user.password;
        // Asegura que el id_user esté presente en la sesión
        req.session.user = { 
            ...user, 
            id_user: user.id_user, 
            profile_picture: user.profile_picture, 
            profile_cover: user.profile_cover,
            about: user.about
        };

        res.redirect('/'); // Redirigir al inicio en vez de dashboard
    });
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.clearCookie('connect.sid');
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

module.exports = router;