const CodigoQR = require('../models/CodigoQR');
const HistorialEscaneo = require('../models/HistorialEscaneo');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');

exports.listarDatosEscaner = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ mensaje: 'Token requerido.' });

    const token = authHeader.split(' ')[1];
    const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_super_segura');
    const regexEmpresa = new RegExp(`^${decodificado.empresa}$`, 'i');
    console.log('Empresa del token:', decodificado.empresa);

    // 1. Obtener los Códigos QR de la empresa
    const codigos = await CodigoQR.find({
    empresaId: regexEmpresa});

    console.log('Codigos encontrados:', codigos.length);
    console.log(codigos);
    
    // 2. Extraer los IDs de esos códigos para buscar su historial
    const idsCodigos = codigos.map(qr => qr._id);

    // 3. Obtener el historial y popular los datos del QR para saber el nombre
    const historial = await HistorialEscaneo.find({ qr_id: { $in: idsCodigos } })
                                            .populate('qr_id', 'nombre url_destino')
                                            .sort({ fecha_hora: -1 });

    return res.status(200).json({ codigos, historial });

  } catch (error) {
    console.error('🔴 Error en escaner:', error);
    return res.status(500).json({ mensaje: 'Error al recuperar datos del escáner.', error: error.message });
  }
};

exports.generarImagenQR = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ mensaje: 'Se requiere una URL para generar el QR.' });

    // Generar la imagen en formato Data URI (Base64)
    const qrBase64 = await QRCode.toDataURL(url, {
      color: { dark: '#181c32', light: '#ffffff' },
      width: 200,
      margin: 2
    });

    return res.status(200).json({ imagenBase64: qrBase64 });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al generar la imagen QR.', error: error.message });
  }
};