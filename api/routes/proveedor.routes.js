const express = require('express');
const router = express.Router();

// Importamos el controlador
const proveedorController = require('../controllers/proveedor.controller');

// Definimos las rutas.
// Como en server.js usaremos '/api/proveedores' como prefijo, aquí solo usamos '/'
router.get('/', proveedorController.obtenerProveedores);
router.post('/', proveedorController.crearProveedor);

// Exportamos el enrutador para usarlo en server.js
module.exports = router;