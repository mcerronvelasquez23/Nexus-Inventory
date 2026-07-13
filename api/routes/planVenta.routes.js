const express = require('express');
const router = express.Router();
const planVentaController = require('../controllers/planVenta.controller');

// POST: /api/plan-venta/registrar
router.post('/registrar', planVentaController.registrarPago);

module.exports = router;