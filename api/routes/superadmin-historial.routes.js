const express = require('express');
const router = express.Router();
const superadminHistorialController = require('../controllers/superadmin-historial.controller');
const { verificarToken, esSuperAdmin } = require('../middlewares/auth.middleware');

// Ruta protegida por token y rol de superadmin
router.get('/', [verificarToken, esSuperAdmin], superadminHistorialController.listarHistorialGlobal);

module.exports = router;