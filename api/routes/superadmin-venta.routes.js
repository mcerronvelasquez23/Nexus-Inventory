const express = require('express');
const router = express.Router();
const superadminVentaController = require('../controllers/superadmin-venta.controller');
const { verificarToken, esSuperAdmin } = require('../middlewares/auth.middleware');

// Ruta analítica centralizada
router.get('/', [verificarToken, esSuperAdmin], superadminVentaController.listarVentasCategorizadas);

module.exports = router;