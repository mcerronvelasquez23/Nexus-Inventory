const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

router.get('/', usuarioController.listarUsuarios);
router.post('/', usuarioController.crearUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;