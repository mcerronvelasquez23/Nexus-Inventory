const Proveedor = require('../models/proveedores');
const jwt = require('jsonwebtoken');

exports.obtenerProveedores = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ mensaje: 'Acceso denegado. Faltan credenciales.' });
    }

    const token = authHeader.split(' ')[1];
    const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_super_segura');
    
    const empresaFiltro = decodificado.empresa; 
    const regexEmpresa = new RegExp(`^${empresaFiltro}$`, 'i');

    // SOLUCIÓN: Filtra por la empresa logueada O incluye registros antiguos sin el campo empresaId
    const proveedores = await Proveedor.find({
      $or: [
        { empresaId: regexEmpresa },
        { empresaId: { $exists: false } }
      ]
    });
    
    return res.status(200).json(proveedores);

  } catch (error) {
    return res.status(500).json({ 
      mensaje: 'Error al recuperar la lista de proveedores', 
      error: error.message 
    });
  }
};

exports.crearProveedor = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ mensaje: 'Acceso denegado. Faltan credenciales.' });
    }

    const token = authHeader.split(' ')[1];
    const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_super_segura');
    const empresaLogueada = decodificado.empresa;

    const { empresa, ruc, telefono, estado } = req.body;
    
    const nuevoProveedor = new Proveedor({ 
      empresa, 
      ruc, 
      telefono, 
      estado: estado || 'Activo',
      empresaId: empresaLogueada 
    });
    
    await nuevoProveedor.save();
    return res.status(201).json(nuevoProveedor);

  } catch (error) {
    return res.status(500).json({ 
      mensaje: 'Error al registrar el proveedor', 
      error: error.message 
    });
  }
};