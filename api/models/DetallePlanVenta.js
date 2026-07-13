const mongoose = require('mongoose');

const detallePlanVentaSchema = new mongoose.Schema({

    ventaId: {
        type: String,
        required: true
    },

    plan: {
        type: String,
        enum: [
            'BASICO',
            'PROFESIONAL',
            'EMPRESARIAL'
        ],
        required: true
    },

    cantidad: {
        type: Number,
        default: 1
    },

    precioUnitario: {
        type: Number,
        required: true
    },

    subtotal: {
        type: Number,
        required: true
    }

},
{
    collection: 'detalle_planventas',
    timestamps: true
});

module.exports =
    mongoose.models.DetallePlanVenta ||
    mongoose.model(
        'DetallePlanVenta',
        detallePlanVentaSchema
    );