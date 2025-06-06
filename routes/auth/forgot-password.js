const express = require('express');
const router = express.Router();

// Mostrar formulario registro sin funcionalidad
router.get('/', (req, res) => {
    res.render('auth/forgot-password'); // Solo muestra la página
});

module.exports = router;