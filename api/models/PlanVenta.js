const mongoose = require('mongoose');

const planVentaSchema = new mongoose.Schema({
  numeroVenta: { type: String, required: true },
  ventaEmpresa: { type: String, required: true },
  plan: { type: String, required: true },
  periodo: { type: String, default: 'MENSUAL' },
  subtotal: { type: Number, required: true },
  igv: { type: Number, required: true },
  total: { type: Number, required: true },
  metodoPago: { type: String, required: true },
  estado: { type: String, default: 'PAGADO' },
  fechaPago: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlanVenta', planVentaSchema, 'planes_ventas');