const express = require('express');
const router = express.Router();
const dbConn = require('../../lib/db');

router.get('/', async (req, res, next) => {
    res.render('dashboard', {
        titleWeb: 'Inicio'
    });
});

module.exports = router;