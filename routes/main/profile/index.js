const express = require('express');
const router = express.Router();
const connection = require('../../../lib/db');
const { uploadProfile, uploadCover } = require('../../../middlewares/uploadProfileCover');
const fs = require('fs');
const path = require('path');

// Middleware para proteger la ruta de perfil
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
}

// GET /profile con flash message
router.get('/', isAuthenticated, (req, res) => {
    const success = req.session.success || null;
    delete req.session.success;
    res.render('main/profile/index', {
        titleWeb: 'Perfil',
        success,
        info: !success ? '¡Bienvenido a tu perfil! Aquí puedes ver y editar tu información personal.' : null
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
    if (!req.file) {
        console.error('No se recibió archivo de imagen de perfil');
        return res.redirect('/profile');
    }
    const userId = req.session.user?.id_user || req.session.id_user;
    const filename = req.file.filename;
    const role = req.session.user?.role || req.session.user?.role_name || 'user';
    const table = getProfileTableByRole(role);
    if (!userId) {
        console.error('No se encontró id_user en la sesión');
        return res.redirect('/profile');
    }
    // Obtener el nombre del archivo anterior
    connection.query(`SELECT profile_picture FROM ${table} WHERE user_id = ?`, [userId], (err, results) => {
        if (err) {
            console.error('Error al obtener la foto de perfil anterior:', err);
            res.redirect('/profile');
        } else {
            const oldProfilePic = results[0]?.profile_picture;
            connection.query(`UPDATE ${table} SET profile_picture = ? WHERE user_id = ?`, [filename, userId], (err, result) => {
                if (err) {
                    console.error('Error al actualizar la foto de perfil:', err);
                    return res.redirect('/profile');
                }
                if (result.affectedRows > 0) {
                    req.session.user.profile_picture = filename;
                    // Eliminar la imagen anterior si existe y no es la predeterminada
                    if (oldProfilePic && oldProfilePic !== '7e68b3ecaa05febd9949a1a1c40c825a.jpg') {
                        const oldPath = path.join(__dirname, '../../../public/uploads/profile/userProfile', oldProfilePic);
                        fs.unlink(oldPath, (err) => {
                            if (err) {
                                console.warn('No se pudo eliminar la imagen anterior:', err.message);
                            }
                        });
                    }
                } else {
                    console.warn('No se actualizó ninguna fila. userId:', userId, 'tabla:', table);
                }
                res.redirect('/profile');
            });
        }
    });
});

// Ruta para actualizar portada
router.post('/edit-cover', isAuthenticated, uploadCover.single('profile_cover'), (req, res) => {
    if (!req.file) {
        console.error('No se recibió archivo de portada');
        return res.redirect('/profile');
    }
    const userId = req.session.user?.id_user || req.session.id_user;
    const filename = req.file.filename;
    const role = req.session.user?.role || req.session.user?.role_name || 'user';
    const table = getProfileTableByRole(role);
    if (!userId) {
        console.error('No se encontró id_user en la sesión');
        return res.redirect('/profile');
    }
    // Obtener el nombre del archivo anterior de portada
    connection.query(`SELECT profile_cover FROM ${table} WHERE user_id = ?`, [userId], (err, results) => {
        if (err) {
            console.error('Error al obtener la portada anterior:', err);
            res.redirect('/profile');
        } else {
            const oldCover = results[0]?.profile_cover;
            connection.query(`UPDATE ${table} SET profile_cover = ? WHERE user_id = ?`, [filename, userId], (err, result) => {
                if (err) {
                    console.error('Error al actualizar la portada:', err);
                    return res.redirect('/profile');
                }
                if (result.affectedRows > 0) {
                    req.session.user.profile_cover = filename;
                    // Eliminar la portada anterior si existe y no es la predeterminada
                    if (oldCover && oldCover !== 'no_cover_available.png') {
                        const oldPath = path.join(__dirname, '../../../public/uploads/profile/userCover', oldCover);
                        fs.unlink(oldPath, (err) => {
                            if (err) {
                                console.warn('No se pudo eliminar la portada anterior:', err.message);
                            }
                        });
                    }
                } else {
                    console.warn('No se actualizó ninguna fila. userId:', userId, 'tabla:', table);
                }
                res.redirect('/profile');
            });
        }
    });
});

// Ruta para mostrar el formulario de edición de perfil
router.get('/edit', isAuthenticated, (req, res) => {
    const userId = req.session.user?.id_user || req.session.id_user;
    const role = req.session.user?.role || req.session.user?.role_name || 'user';
    const table = getProfileTableByRole(role);
    const success = req.query.success ? true : false;
    // Traer datos completos del usuario y perfil
    connection.query(
        `SELECT u.*, p.phone, p.address, p.about FROM users u LEFT JOIN ${table} p ON u.id_user = p.user_id WHERE u.id_user = ?`,
        [userId],
        (err, results) => {
            if (err || results.length === 0) {
                return res.render('main/profile/edit', { user: req.session.user, success });
            }
            // Mezclar los datos de sesión y los de la base de datos
            const user = { ...req.session.user, ...results[0] };
            res.render('main/profile/edit', { user, success });
        }
    );
});

// Ruta para procesar el formulario de edición de perfil
router.post('/edit', isAuthenticated, (req, res) => {
    const userId = req.session.user?.id_user || req.session.id_user;
    const role = req.session.user?.role || req.session.user?.role_name || 'user';
    const table = getProfileTableByRole(role);
    const {
        first_name,
        middle_name,
        last_name,
        second_last_name,
        username,
        email,
        document_type,
        document_number,
        birth_date,
        phone,
        address,
        about
    } = req.body;
    if (!userId) {
        return res.redirect('/profile');
    }
    // Validar unicidad de username, email y documento (excepto el propio usuario)
    const checkUniqueQuery = `SELECT id_user FROM users WHERE (username = ? OR email = ? OR document_number = ?) AND id_user != ?`;
    connection.query(checkUniqueQuery, [username, email, document_number, userId], (err, results) => {
        if (err) {
            console.error('Error al validar unicidad:', err);
            return res.redirect('/profile/edit');
        }
        if (results.length > 0) {
            // Hay conflicto de datos únicos
            return res.render('main/profile/edit', { user: { ...req.body, id_user: userId }, error: 'El usuario, correo o documento ya está en uso.' });
        }
        // Actualizar tabla users
        const updateUserQuery = `UPDATE users SET first_name=?, middle_name=?, last_name=?, second_last_name=?, username=?, email=?, document_type=?, document_number=?, birth_date=? WHERE id_user=?`;
        const userParams = [first_name, middle_name, last_name, second_last_name, username, email, document_type, document_number, birth_date, userId];
        connection.query(updateUserQuery, userParams, (err) => {
            if (err) {
                console.error('Error al actualizar usuario:', err);
                return res.redirect('/profile/edit');
            }
            // Actualizar tabla de perfil
            const updateProfileQuery = `UPDATE ${table} SET phone=?, address=?, about=? WHERE user_id=?`;
            const profileParams = [phone, address, about, userId];
            connection.query(updateProfileQuery, profileParams, (err) => {
                if (err) {
                    console.error('Error al actualizar perfil:', err);
                    return res.redirect('/profile/edit');
                }
                // Actualizar la sesión
                req.session.user = {
                    ...req.session.user,
                    first_name,
                    middle_name,
                    last_name,
                    second_last_name,
                    username,
                    email,
                    document_type,
                    document_number,
                    birth_date,
                    phone,
                    address,
                    about
                };
                // Guardar mensaje de éxito en sesión y redirigir limpio
                req.session.success = '¡Perfil actualizado exitosamente!';
                res.redirect('/profile');
            });
        });
    });
});

module.exports = router;