const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');

// Línea 7: Ahora ya no fallará porque 'registrarComprasBulk' ya existe en el controlador
router.post('/bulk-compras', productoController.registrarComprasBulk);

router.get('/', productoController.listarProductos);

router.get('/alertas-stock', productoController.obtenerAlertasStock);

router.delete('/:id', productoController.eliminarProducto);

module.exports = router;