const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../../lib/db');

// Mostrar formulario registro
router.get('/', (req, res) => {
    res.render('auth/register', { error: null, success: null });
});

// Procesar registro
router.post('/', async (req, res) => {
    const {
        first_name, middle_name, last_name, second_last_name,
        document_type, document_number, phone, birth_date,
        username, email, password
    } = req.body;

    // Validaciones básicas
    if (!first_name || !last_name || !document_type || !document_number || !birth_date || !email || !password) {
        return res.render('auth/register', { error: 'Por favor completa todos los campos obligatorios.', success: null });
    }

    try {
        // Verificar si el correo, usuario o documento ya existen
        const checkQuery = 'SELECT * FROM users WHERE email = ? OR username = ? OR document_number = ?';
        connection.query(checkQuery, [email, username, document_number], async (err, results) => {
            if (err) return res.render('auth/register', { error: 'Error en el servidor.', success: null });
            if (results.length > 0) {
                return res.render('auth/register', { error: 'El correo, usuario o documento ya están registrados.', success: null });
            }

            // Buscar el id del rol 'user' dinámicamente
            const roleQuery = "SELECT id_role FROM roles WHERE name = 'user' LIMIT 1";
            connection.query(roleQuery, async (err, roleResults) => {
                if (err || roleResults.length === 0) {
                    return res.render('auth/register', { error: 'No se encontró el rol de usuario.', success: null });
                }
                const role_id = roleResults[0].id_role;

                // Hashear contraseña
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insertar usuario
                const insertUser = `INSERT INTO users (first_name, middle_name, last_name, second_last_name, username, document_type, document_number, birth_date, email, password, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const userValues = [first_name, middle_name || null, last_name, second_last_name || null, username || null, document_type, document_number, birth_date, email, hashedPassword, role_id];
                connection.query(insertUser, userValues, (err, userResult) => {
                    if (err) return res.render('auth/register', { error: 'Error al registrar usuario.', success: null });
                    const user_id = userResult.insertId;

                    // Insertar perfil extendido
                    const insertProfile = `INSERT INTO user_profiles (user_id, phone) VALUES (?, ?)`;
                    connection.query(insertProfile, [user_id, phone || null], (err) => {
                        if (err) return res.render('auth/register', { error: 'Error al crear perfil.', success: null });
                        // Registro exitoso
                        res.render('auth/login', { error: null, success: '¡Registro exitoso! Ahora puedes iniciar sesión.' });
                    });
                });
            });
        });
    } catch (e) {
        return res.render('auth/register', { error: 'Error inesperado.', success: null });
    }
});

module.exports = router;