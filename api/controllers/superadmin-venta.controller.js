const PlanVenta = require('../models/PlanVenta');

// GET: Obtener ventas globales segmentadas por el tipo de plan
exports.listarVentasCategorizadas = async (req, res) => {
    try {
        // Ejecutamos las búsquedas de forma paralela en la base de datos
        const [planBasico, planPro, planEnterprise] = await Promise.all([
            PlanVenta.find({ plan: { $regex: '^basico$', $options: 'i' } }).sort({ fechaPago: -1 }),
            PlanVenta.find({ plan: { $regex: '^pro$', $options: 'i' } }).sort({ fechaPago: -1 }),
            PlanVenta.find({ plan: { $regex: '^enterprise$', $options: 'i' } }).sort({ fechaPago: -1 })
        ]);

        return res.status(200).json({
            success: true,
            data: {
                basico: planBasico,
                pro: planPro,
                enterprise: planEnterprise
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            mensaje: 'Error de infraestructura al segmentar el catálogo de ventas.',
            error: error.message
        });
    }
};