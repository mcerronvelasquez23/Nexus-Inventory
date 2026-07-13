const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');
const Venta = require('../models/Venta');
const jwt = require('jsonwebtoken');

exports.getDashboardKPIs = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ mensaje: 'Acceso denegado. Faltan credenciales.' });
        }

        const token = authHeader.split(' ')[1];
        const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_super_segura');
        const empresaFiltro = decodificado.empresa; 
        const regexEmpresa = new RegExp(`^${empresaFiltro}$`, 'i');

        // Consultas base en paralelo
        const [totalProductos, totalUsuarios, registroVenta, productosEmpresa] = await Promise.all([
            Producto.countDocuments({ empresaId: regexEmpresa }),
            Usuario.countDocuments({ empresa: regexEmpresa, rol: { $in: ['admin', 'usuario'] } }),
            Venta.findOne({ empresa: regexEmpresa }),
            Producto.find({ empresaId: regexEmpresa })
        ]);

        const totalVentas = registroVenta ? registroVenta.cantidadVentas : 0;

        // ==========================================
        // PROCESAMIENTO DE LOS 6 GRÁFICOS
        // ==========================================

        // 1. Gráfico: Próximos a acabarse
        const proximosAgotarse = await Producto.find({ empresaId: regexEmpresa })
            .sort({ stock: 1 })
            .limit(5)
            .select('nombre stock stockMinimo');

        // 2. Gráfico: Productos más rentables (Margen de ganancia neto)
        const productosRentables = await Producto.aggregate([
            { $match: { empresaId: regexEmpresa } },
            { $addFields: { margen: { $subtract: ["$precioVenta", "$precioCompra"] } } },
            { $sort: { margen: -1 } },
            { $limit: 5 },
            { $project: { nombre: 1, margen: 1 } }
        ]);

        // 3. Gráfico: Distribución de productos por Categoría
        const porCategoria = await Producto.aggregate([
            { $match: { empresaId: regexEmpresa } },
            { $group: { _id: "$categoria", total: { $sum: 1 } } }
        ]);

        // 4. Gráfico: Inversión vs Retorno Estimado por Categoría
        const inversionRetorno = await Producto.aggregate([
            { $match: { empresaId: regexEmpresa } },
            { $group: {
                _id: "$categoria",
                inversion: { $sum: { $multiply: ["$stock", "$precioCompra"] } },
                retornoEstimado: { $sum: { $multiply: ["$stock", "$precioVenta"] } }
            }}
        ]);

        // 5. Gráfico: Salud del Stock (Crítico, Riesgo, Estable)
        let saludStock = { critico: 0, riesgo: 0, estable: 0 };
        productosEmpresa.forEach(p => {
            const currentStock = p.stock || 0;
            const minStock = p.stockMinimo || 0;
            if (currentStock <= minStock) {
                saludStock.critico++;
            } else if (currentStock <= minStock * 2) {
                saludStock.riesgo++;
            } else {
                saludStock.estable++;
            }
        });

        // 🔥 NUEVO - 6. Gráfico: Top 5 Proveedores por Volumen de Stock Suministrado
        const porProveedor = await Producto.aggregate([
            { $match: { empresaId: regexEmpresa, stock: { $gt: 0 } } }, 
            { $group: { _id: "$proveedor", totalStock: { $sum: "$stock" } } },
            { $sort: { totalStock: -1 } },
            { $limit: 5 }
        ]);

        // Enviar respuesta consolidada con los 6 gráficos
        res.status(200).json({
            totalProductos,
            totalVentas,
            totalUsuarios,
            graficos: {
                proximosAgotarse,
                productosRentables,
                porCategoria,
                inversionRetorno,
                saludStock,
                porProveedor // Añadido al JSON de salida
            }
        });

    } catch (error) {
        console.error('🔴 Error obteniendo KPIs y Gráficos:', error);
        res.status(500).json({ mensaje: 'Error al obtener datos estructurados del dashboard' });
    }
};