// Usamos el modelo PlanVenta porque ahí es donde están registrados los pagos reales
const PlanVenta = require('../models/PlanVenta'); 

exports.listarHistorialGlobal = async (req, res) => {
    try {
        // Obtenemos todas las ventas, de la más reciente a la más antigua
        const ventas = await PlanVenta.find({}).sort({ fechaPago: -1 });

        // Transformamos (mapeamos) los campos de PlanVenta para que encajen 
        // exactamente con las columnas que tu componente de Angular espera
        const historialFormateado = ventas.map(venta => ({
            ventaId: venta.numeroVenta,     // Mapeamos numeroVenta -> ventaId
            empresa: venta.ventaEmpresa,    // Mapeamos ventaEmpresa -> empresa
            plan: venta.plan,
            monto: venta.total,             // Mapeamos total -> monto
            estado: venta.estado,
            fechaVenta: venta.fechaPago     // Mapeamos fechaPago -> fechaVenta
        }));

        return res.status(200).json({
            success: true,
            data: historialFormateado
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            mensaje: 'Error de servidor al recuperar el registro maestro de historial.',
            error: error.message
        });
    }
};