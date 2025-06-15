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
    console.log('Intento de login:', userIdentifier);

    // Buscar por email o username
    const query = `SELECT u.*, up.profile_picture, up.profile_cover, up.about FROM users u LEFT JOIN user_profiles up ON u.id_user = up.user_id WHERE u.email = ? OR u.username = ?`;
    connection.query(query, [userIdentifier, userIdentifier], async (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.render('auth/login', { error: 'Error en el servidor', success: null });
        }
        if (results.length === 0) {
            console.log('Usuario no encontrado para:', userIdentifier);
            return res.render('auth/login', { error: 'Usuario no encontrado', success: null });
        }

        const user = results[0];
        console.log('Usuario encontrado:', user);
        if (!user.password) {
            console.log('El usuario no tiene contraseña registrada en la base de datos.');
            return res.render('auth/login', { error: 'Contraseña incorrecta', success: null });
        }
        let match = false;
        try {
            match = await bcrypt.compare(password, user.password);
        } catch (bcryptErr) {
            console.error('Error al comparar contraseñas:', bcryptErr);
            return res.render('auth/login', { error: 'Error en la autenticación', success: null });
        }
        if (!match) {
            console.log('Contraseña incorrecta para usuario:', userIdentifier);
            return res.render('auth/login', { error: 'Contraseña incorrecta', success: null });
        }

        // Elimina la contraseña antes de guardar en sesión
        delete user.password;

        // Obtener el nombre del rol
        const roleQuery = 'SELECT name FROM roles WHERE id_role = ?';
        connection.query(roleQuery, [user.role_id], (roleErr, roleResults) => {
            if (roleErr || roleResults.length === 0) {
                console.error('Error obteniendo el rol:', roleErr);
                return res.render('auth/login', { error: 'Error en la autenticación', success: null });
            }
            const roleName = roleResults[0].name;
            let profileTable = '';
            switch (roleName) {
                case 'admin':
                    profileTable = 'admin_profiles';
                    break;
                case 'librarian':
                    profileTable = 'librarian_profiles';
                    break;
                case 'author':
                    profileTable = 'author_profiles';
                    break;
                default:
                    profileTable = 'user_profiles';
            }
            const profileQuery = `SELECT * FROM ${profileTable} WHERE user_id = ?`;
            connection.query(profileQuery, [user.id_user], (profileErr, profileResults) => {
                if (profileErr) {
                    console.error('Error obteniendo perfil:', profileErr);
                    return res.render('auth/login', { error: 'Error en la autenticación', success: null });
                }
                // Guardar datos de usuario y perfil en sesión
                req.session.user = {
                    ...user,
                    id_user: user.id_user,
                    role: roleName,
                    profile: profileResults[0] || null // Puede ser null si no hay perfil
                };
                console.log('Login exitoso para:', userIdentifier, 'con rol:', roleName);
                res.redirect('/');
            });
        });
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