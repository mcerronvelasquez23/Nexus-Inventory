const Categoria = require('../models/Categoria');
const Producto = require('../models/Producto');
const jwt = require('jsonwebtoken');

exports.obtenerCategorias = async (req, res) => {

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

    const regexEmpresa =
      new RegExp(`^${empresaFiltro}$`, 'i');

    const categorias = await Categoria.find();

    const resultado = [];

    for (const categoria of categorias) {

      const productos = await Producto.find({

        categoria: categoria.nombre,

        empresaId: regexEmpresa

      });

      const stockTotal = productos.reduce(
        (total, producto) =>
          total + producto.stock,
        0
      );

      resultado.push({

        nombre: categoria.nombre,

        stockTotal,

        tieneStock: stockTotal > 0,

        totalProductos:
          productos.length

      });

    }

    res.json(resultado);

  } catch (error) {

    console.error(error);

    res.status(500).json({

      mensaje:
      'Error al obtener categorías'

    });

  }

};