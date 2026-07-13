const express = require('express');
const router = express.Router();
const escanerController = require('../controllers/escaner.controller');

router.get('/datos', escanerController.listarDatosEscaner);
router.post('/generar-imagen', escanerController.generarImagenQR);

module.exports = router;