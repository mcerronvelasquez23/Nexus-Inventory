const express = require('express');
const router = express.Router();

// Importamos nuestro nuevo controlador independiente
const empresaController = require('../controllers/empresa.controller');

// Importamos los filtros de seguridad
const { verificarToken, esSuperAdmin } = require('../middlewares/auth.middleware');

// Definimos las rutas relativas al módulo
router.get('/', [verificarToken, esSuperAdmin], empresaController.listarEmpresasGlobal);
router.delete('/:nombre', [verificarToken, esSuperAdmin], empresaController.eliminarEmpresaGlobal);

module.exports = router;