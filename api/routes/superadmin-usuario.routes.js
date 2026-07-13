const express = require('express');
const router = express.Router();
const superadminUsuarioController = require('../controllers/superadmin-usuario.controller');
const { verificarToken, esSuperAdmin } = require('../middlewares/auth.middleware');

// Rutas relativas al superadmin-usuarios
router.get('/', [verificarToken, esSuperAdmin], superadminUsuarioController.listarUsuariosGlobal);
router.post('/', [verificarToken, esSuperAdmin], superadminUsuarioController.crearSuperadmin);
router.put('/:id/desbloquear', [verificarToken, esSuperAdmin], superadminUsuarioController.desbloquearUsuario);
router.delete('/:id', [verificarToken, esSuperAdmin], superadminUsuarioController.eliminarUsuarioGlobal);

module.exports = router;