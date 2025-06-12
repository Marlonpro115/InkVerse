const express = require('express');
const router = express.Router();
const connection = require('../../../lib/db');
const { uploadProfile, uploadCover } = require('../../../middlewares/uploadProfileCover');

// Middleware para proteger la ruta de perfil
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
}

router.get('/', isAuthenticated, (req, res) => {
    res.render('main/profile/index', {
        titleWeb: 'Perfil'
    });
});

// Función auxiliar para obtener la tabla de perfil según el rol
function getProfileTableByRole(role) {
    switch (role) {
        case 'admin':
            return 'admin_profiles';
        case 'librarian':
            return 'librarian_profiles';
        case 'author':
            return 'author_profiles';
        case 'client':
            return 'client_profiles';
        default:
            return 'user_profiles';
    }
}

// Ruta para actualizar foto de perfil
router.post('/edit-picture', isAuthenticated, uploadProfile.single('profile_picture'), (req, res) => {
    if (!req.file) return res.redirect('/profile');
    const userId = req.session.user.id;
    const filename = req.file.filename;
    const role = req.session.user.role || req.session.user.role_name || 'user';
    const table = getProfileTableByRole(role);
    connection.query(`UPDATE ${table} SET profile_picture = ? WHERE user_id = ?`, [filename, userId], (err) => {
        if (!err) req.session.user.profile_picture = filename;
        res.redirect('/profile');
    });
});

// Ruta para actualizar portada
router.post('/edit-cover', isAuthenticated, uploadCover.single('profile_cover'), (req, res) => {
    if (!req.file) return res.redirect('/profile');
    const userId = req.session.user.id;
    const filename = req.file.filename;
    const role = req.session.user.role || req.session.user.role_name || 'user';
    const table = getProfileTableByRole(role);
    connection.query(`UPDATE ${table} SET profile_cover = ? WHERE user_id = ?`, [filename, userId], (err) => {
        if (!err) req.session.user.profile_cover = filename; // Actualiza la sesión con la nueva portada
        res.redirect('/profile');
    });
});

module.exports = router;