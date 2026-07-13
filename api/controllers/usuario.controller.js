const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// 1. Listar usuarios pertenecientes a la empresa logueada
exports.listarUsuarios = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ mensaje: 'Token requerido.' });
    }

    const token = authHeader.split(' ')[1];
    const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_super_segura');
    
    const empresaFiltro = decodificado.empresa;
    const regexEmpresa = new RegExp(`^${empresaFiltro}$`, 'i');

    // Recuperamos todos los usuarios y administradores de esta empresa
    const usuarios = await Usuario.find({ empresa: regexEmpresa }).select('-password');
    return res.status(200).json(usuarios);

  } catch (error) {
    console.error('🔴 Error al listar usuarios:', error);
    return res.status(500).json({ mensaje: 'Error de servidor al recuperar usuarios.', error: error.message });
  }
};

// 2. Crear usuario (Solo permitido para administradores de la misma empresa)
exports.crearUsuario = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ mensaje: 'Token requerido.' });
    }

    const token = authHeader.split(' ')[1];
    const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_super_segura');

    // Verificación estricta de Rol
    if (decodificado.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado. Solo los administradores pueden realizar esta acción.' });
    }

    const { correo, nombre, password, rol } = req.body;
    
    if (!correo || !nombre || !password || !rol) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    // Validar que el rol asignado sea permitido
    if (!['usuario', 'admin'].includes(rol)) {
      return res.status(400).json({ mensaje: 'Rol inválido asignado.' });
    }

    const empresaLogueada = decodificado.empresa;

    // Verificar duplicidad de correo electrónico
    const usuarioExistente = await Usuario.findOne({ correo: correo.toLowerCase() });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo electrónico ya se encuentra registrado.' });
    }

    const nuevoUsuario = new Usuario({
      correo,
      nombre,
      password,
      rol,
      empresa: empresaLogueada.toLowerCase(),
      estado: true,
      intentosFallidos: 0,
      fechaRegistro: new Date()
    });

    // El hook .pre('save') definido en tu Usuario.js encriptará la contraseña automáticamente
    await nuevoUsuario.save();
    
    // Devolvemos el objeto sin la contraseña por seguridad
    const respuestaUsuario = nuevoUsuario.toObject();
    delete respuestaUsuario.password;

    return res.status(201).json(respuestaUsuario);

  } catch (error) {
    console.error('🔴 Error al crear usuario:', error);
    return res.status(500).json({ mensaje: 'Error de servidor al registrar usuario.', error: error.message });
  }
};

// 3. Eliminar usuario (Solo permitido para administradores sobre usuarios de su misma empresa)
exports.eliminarUsuario = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ mensaje: 'Token requerido.' });
    }

    const token = authHeader.split(' ')[1];
    const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_super_segura');

    if (decodificado.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado. Solo los administradores pueden eliminar usuarios.' });
    }

    const idAEliminar = req.params.id;
    const empresaLogueada = decodificado.empresa;
    const regexEmpresa = new RegExp(`^${empresaLogueada}$`, 'i');

    // Buscamos el usuario asegurándonos de que pertenezca a la misma organización para mitigar vulnerabilidades cross-tenant
    const usuarioABorrar = await Usuario.findOne({ _id: idAEliminar, empresa: regexEmpresa });
    
    if (!usuarioABorrar) {
      return res.status(444).json({ mensaje: 'Usuario no encontrado o no pertenece a su organización.' });
    }

    // Evitar que un administrador se elimine a sí mismo
    if (usuarioABorrar.correo === decodificado.correo) {
      return res.status(400).json({ mensaje: 'No es posible auto-eliminarse del sistema.' });
    }

    await Usuario.deleteOne({ _id: idAEliminar });
    return res.status(200).json({ mensaje: 'Usuario removido del ecosistema de manera exitosa.' });

  } catch (error) {
    console.error('🔴 Error al eliminar usuario:', error);
    return res.status(500).json({ mensaje: 'Error de servidor al remover usuario.', error: error.message });
  }
};