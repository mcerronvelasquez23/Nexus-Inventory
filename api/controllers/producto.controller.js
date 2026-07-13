const jwt = require('jsonwebtoken');
// Asegúrate de cambiar la ruta de abajo por la ubicación real de tu modelo de Producto
const Producto = require('../models/Producto');

exports.obtenerAlertasStock = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ mensaje: 'Token requerido' });
    }

    const token = authHeader.split(' ')[1];
    const usuario = jwt.verify(
      token,
      process.env.JWT_SECRET || 'clave_secreta_super_segura'
    );

    const empresaFiltro = usuario.empresa;
    const regexEmpresa = new RegExp(`^${empresaFiltro}$`, 'i');

    const productos = await Producto.find({ empresaId: regexEmpresa });
    const alertas = [];

    productos.forEach(producto => {
      let tipo = '';
      let mensaje = '';
      const stock = Number(producto.stock) || 0;
      const stockMinimo = Number(producto.stockMinimo) || 10;

      if (stock <= stockMinimo) {
        tipo = 'CRITICO';
        mensaje = `El producto ${producto.nombre} tiene stock crítico (${stock} unidades).`;
      } else if (stock <= stockMinimo * 2) {
        tipo = 'RIESGO';
        mensaje = `El producto ${producto.nombre} podría agotarse pronto (${stock} unidades).`;
      }

      if (tipo !== '') {
        alertas.push({
          nombreProducto: producto.nombre,
          tipo,
          mensaje,
          fecha: producto.fechaRegistro || new Date(),
          stock
        });
      }
    });

    res.json(alertas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: error.message });
  }
};

// ======================================
// OTRAS FUNCIONES (Necesarias para tus rutas)
// ======================================
exports.registrarComprasBulk = async (req, res) => {
  try {
    // 1. Verificación de seguridad (Opcional pero recomendada)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ mensaje: 'Token requerido para esta operación.' });
    }

    // 2. Extraer el array de productos que viene desde Angular
    const productosNuevos = req.body; 

    // Validar que realmente venga un array con datos
    if (!Array.isArray(productosNuevos) || productosNuevos.length === 0) {
      return res.status(400).json({ mensaje: "No se enviaron productos válidos para registrar." });
    }

    // 3. Insertar masivamente en la base de datos usando Mongoose
    const resultado = await Producto.insertMany(productosNuevos);

    // 4. Responder a Angular con el verdadero éxito de la operación
    res.status(201).json({ 
      mensaje: "Productos registrados correctamente en el inventario",
      cantidadInsertada: resultado.length
    });

  } catch (error) {
    console.error('🔴 Error real al insertar en bulk:', error);
    res.status(500).json({ 
      mensaje: 'Hubo un error al guardar los productos en la base de datos', 
      error: error.message 
    });
  }
};

exports.listarProductos = async (req, res) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        mensaje: 'Token requerido'
      });
    }

    const token = authHeader.split(' ')[1];

    const usuario = jwt.verify(
      token,
      process.env.JWT_SECRET || 'clave_secreta_super_segura'
    );

    const empresaFiltro = usuario.empresa;

    console.log(
    'EMPRESA TOKEN:',
    empresaFiltro
    );

    const regexEmpresa = new RegExp(
      `^${empresaFiltro}$`,
      'i'
    );

    const productos = await Producto.find({
      empresaId: regexEmpresa
    });

    console.log(
    'PRODUCTOS:',
    productos
    );

    res.json(productos);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: error.message
    });

  }
};

exports.eliminarProducto = async (req, res) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        mensaje: 'Token requerido'
      });
    }

    const token = authHeader.split(' ')[1];

    const usuario = jwt.verify(
      token,
      process.env.JWT_SECRET || 'clave_secreta_super_segura'
    );

    const empresaFiltro = usuario.empresa;

    const regexEmpresa = new RegExp(
      `^${empresaFiltro}$`,
      'i'
    );

    const producto = await Producto.findOneAndDelete({
      _id: req.params.id,
      empresaId: regexEmpresa
    });

    if (!producto) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado'
      });
    }

    res.json({
      mensaje: 'Producto eliminado correctamente'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: error.message
    });

  }
};