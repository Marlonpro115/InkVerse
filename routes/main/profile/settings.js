const express = require('express');
const router = express.Router();
const dbConn = require('../../../lib/db');

router.get('/', async (req, res, next) => {
    res.render('main/profile/settings', {
        titleWeb: 'Configuración',
    });
});

module.exports = router;