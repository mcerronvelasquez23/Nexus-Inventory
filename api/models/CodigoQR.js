const mongoose = require('mongoose');

const codigoQRSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  empresaId: { type: String, required: true }, 
  nombre: { type: String, required: true },
  tipo: { type: String, default: 'url_dinamica' },
  url_destino: { type: String, required: true },
  activo: { type: Boolean, default: true },
  fecha_creacion: { type: Date, default: Date.now }
}, { collection: 'codigos_qr' });

module.exports = mongoose.model('CodigoQR', codigoQRSchema);