const mongoose = require('mongoose');

const ReportePDFSchema = new mongoose.Schema({
  nombreArchivo: { type: String, required: true },
  rutaArchivo: { type: String, required: true },
  fechaGeneracion: { type: Date, default: Date.now }
}, { 
  timestamps: false,
  collection: 'reportesPDF' 
});

module.exports = mongoose.model('ReportePDF', ReportePDFSchema);