const mongoose = require('mongoose');

const detalleVentaSchema = new mongoose.Schema({

    empresa: {
        type: String,
        required: true,
        trim: true
    },

    productoId: {
        type: String,
        required: true
    },

    nombreProducto: {
        type: String,
        required: true
    },

    cantidad: {
        type: Number,
        required: true,
        min: 1
    },

    precioUnitario: {
        type: Number,
        required: true
    },

    total: {
        type: Number,
        required: true
    },

    fecha: {
        type: Date,
        default: Date.now
    }

},
{
    collection: 'detalle_ventas'
});

module.exports =
    mongoose.models.DetalleVenta ||
    mongoose.model(
        'DetalleVenta',
        detalleVentaSchema
    );