const Venta = require('../models/Venta');
const Producto = require('../models/Producto');
const jwt = require('jsonwebtoken');

exports.obtenerVentas = async (req, res) => {
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

    const empresa = usuario.empresa.trim();

    const regexEmpresa = new RegExp(`^${empresa}$`, 'i');

    const ventas = await Venta.find({
      empresa: regexEmpresa
    });

    const productos = await Producto.find({
      empresaId: regexEmpresa
    });

    const productosCriticos = productos
      .filter(p => p.stock <= p.stockMinimo)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);

    const mejoresProductos = [...productos]
      .sort(
        (a, b) =>
          (b.precioVenta * b.stock) -
          (a.precioVenta * a.stock)
      )
      .slice(0, 5);

    res.json({
      ventas,
      productosCriticos,
      mejoresProductos
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error al obtener ventas'
    });

  }
};

exports.registrarVenta = async (req, res) => {

  try {

    //----------------------------------------
    // TOKEN
    //----------------------------------------

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

    const empresa = usuario.empresa.trim();

    const regexEmpresa = new RegExp(`^${empresa}$`, 'i');

    //----------------------------------------
    // DATOS
    //----------------------------------------

    let { productoId, cantidad } = req.body;

    cantidad = Number(cantidad);

    if (!productoId) {
      return res.status(400).json({
        mensaje: 'Debe seleccionar un producto'
      });
    }

    if (isNaN(cantidad) || cantidad <= 0) {
      return res.status(400).json({
        mensaje: 'Cantidad inválida'
      });
    }

    //----------------------------------------
    // BUSCAR PRODUCTO
    //----------------------------------------

    const producto = await Producto.findOne({
      _id: productoId,
      empresaId: regexEmpresa
    });

    if (!producto) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado'
      });
    }

    //----------------------------------------
    // VALIDAR STOCK
    //----------------------------------------

    if (producto.stock < cantidad) {
      return res.status(400).json({
        mensaje: 'Stock insuficiente'
      });
    }

    //----------------------------------------
    // DESCONTAR STOCK
    //----------------------------------------

    producto.stock -= cantidad;

    await producto.save();

    //----------------------------------------
    // TOTAL
    //----------------------------------------

    const totalVenta =
      producto.precioVenta * cantidad;

    //----------------------------------------
    // BUSCAR O CREAR RESUMEN
    //----------------------------------------

    let venta = await Venta.findOne({
      empresa: regexEmpresa
    });

    if (!venta) {

      venta = new Venta({

        empresa,

        cantidadVentas: 0,

        ingresosTotales: 0,

        planActual: 'BASICO'

      });

    }

    //----------------------------------------
    // ACTUALIZAR RESUMEN
    //----------------------------------------

    venta.cantidadVentas += 1;

    venta.ingresosTotales += totalVenta;

    venta.fechaActualizacion = new Date();

    await venta.save();

    //----------------------------------------
    // RESPUESTA
    //----------------------------------------

    res.status(200).json({

      mensaje: 'Venta registrada correctamente',

      venta,

      producto

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: error.message
    });

  }

};