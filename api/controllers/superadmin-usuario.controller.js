const Usuario = require('../models/Usuario');

exports.listarUsuariosGlobal = async (req, res) => {
    try {
        const usuarios = await Usuario.find({}, { password: 0, __v: 0 }).sort({ fechaRegistro: -1 });
        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al recuperar usuarios globales.', error: error.message });
    }
};

exports.crearSuperadmin = async (req, res) => {
    try {
        const { correo, nombre, password, empresa } = req.body;

        if (!correo || !nombre || !password || !empresa) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
        }

        const usuarioExistente = await Usuario.findOne({ correo: correo.toLowerCase() });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado.' });
        }

        const nuevoSuperadmin = new Usuario({
            correo,
            nombre,
            password,
            rol: 'superadmin',
            empresa: empresa.trim().toLowerCase(),
            estado: true,
            intentosFallidos: 0
        });

        await nuevoSuperadmin.save();
        const respuesta = nuevoSuperadmin.toObject();
        delete respuesta.password;

        return res.status(201).json(respuesta);
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al registrar al superadmin.', error: error.message });
    }
};

exports.desbloquearUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            { $set: { intentosFallidos: 0, estado: true } },
            { new: true }
        ).select('-password');

        if (!usuarioActualizado) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }

        return res.status(200).json({ mensaje: 'Cuenta desbloqueada.', usuario: usuarioActualizado });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al desbloquear.', error: error.message });
    }
};

exports.eliminarUsuarioGlobal = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (id === req.usuarioId) { 
            return res.status(400).json({ mensaje: 'No es posible auto-eliminarse.' });
        }

        const resultado = await Usuario.deleteOne({ _id: id });
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ mensaje: 'El usuario no existe.' });
        }

        return res.status(200).json({ mensaje: 'Usuario eliminado del ecosistema global.' });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al remover el perfil.', error: error.message });
    }
};