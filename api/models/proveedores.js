const mongoose = require('mongoose');

const ProveedorSchema = new mongoose.Schema({
  empresa: {
    type: String,
    required: true
  },
  ruc: {
    type: String,
    required: true,
    unique: true
  },
  telefono: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['Activo', 'Inactivo'],
    default: 'Activo'
  },
  // NUEVO CAMPO: Se configura de forma opcional para mantener compatibilidad con tus datos previos
  empresaId: {
    type: String,
    required: false
  }
}, { 
  timestamps: true,
  collection: 'proveedores'
});

module.exports = mongoose.model('Proveedor', ProveedorSchema);