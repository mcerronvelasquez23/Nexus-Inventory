const express = require('express');
const router = express.Router();

const superadminController = require('../controllers/superadmin.controller');

const { verificarToken, esSuperAdmin } = require('../middlewares/auth.middleware');
router.get(
    '/dashboard',
    [verificarToken, esSuperAdmin],
    superadminController.obtenerDashboard
);

module.exports = router;