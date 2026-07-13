const mongoose = require('mongoose');

const historialSchema = new mongoose.Schema({
  qr_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CodigoQR', required: true },
  fecha_hora: { type: Date, default: Date.now },
  dispositivo: {
    sistema_operativo: { type: String },
    navegador: { type: String },
    tipo: { type: String } 
  }
}, { collection: 'historial_escaneos' });

module.exports = mongoose.model('HistorialEscaneo', historialSchema);