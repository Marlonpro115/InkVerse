const express = require('express');
const router = express.Router();

// Mostrar formulario registro sin funcionalidad
router.get('/', (req, res) => {
    res.render('auth/register'); // Solo muestra la página
});

module.exports = router;