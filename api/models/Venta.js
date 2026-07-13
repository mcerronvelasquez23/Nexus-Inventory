const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({

    empresa: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    cantidadVentas: {
        type: Number,
        default: 0
    },

    ingresosTotales: {
        type: Number,
        default: 0
    },

    ultimoPago: {
        type: Date,
        default: null
    },

    planActual: {
        type: String,
        enum: [
            'BASICO',
            'PROFESIONAL',
            'EMPRESARIAL'
        ],
        default: 'BASICO'
    },

    ventaPromedioDiaria: {
        type: Number,
        default: 0
    },

    diasCobertura: {
        type: Number,
        default: 0
    },

    cantidadSugeridaCompra: {
        type: Number,
        default: 0
    },

    estado: {
        type: String,
        enum: [
            'NORMAL',
            'CRITICO',
            'REQUIERE_REABASTECIMIENTO'
        ],
        default: 'NORMAL'
    },

    fechaActualizacion: {
        type: Date,
        default: Date.now
    }

},
{
    collection: 'ventas'
});

module.exports =
    mongoose.models.Venta ||
    mongoose.model(
        'Venta',
        ventaSchema
    );