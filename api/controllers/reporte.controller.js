const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Venta = require('../models/Venta');
const Producto = require('../models/Producto');
const ReportePDF = require('../models/ReportePDF');
const jwt = require('jsonwebtoken');

exports.generarReportePDF = async (req, res) => {
  try {
    // 1. Validar cabeceras y decodificar sesión activa
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ mensaje: 'Acceso denegado. Faltan credenciales de autorización.' });
    }

    const token = authHeader.split(' ')[1];
    const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_super_segura');
    const empresaFiltro = decodificado.empresa;
    const regexEmpresa = new RegExp(`^${empresaFiltro}$`, 'i');

    // 2. Extraer información cruzada de las colecciones correspondientes
    const datosVenta = await Venta.findOne({ empresa: regexEmpresa });
    const listaProductos = await Producto.find({ empresaId: regexEmpresa });

    // 3. Inicializar el lienzo del documento PDF corporativo
    const doc = new PDFDocument({ margin: 50 });
    const timestamp = Date.now();
    const nombreArchivo = `reporte_${empresaFiltro.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.pdf`;
    
    // Ruta física para persistir el archivo estático en el servidor
    const carpetaDestino = path.join(__dirname, '../public/pdf/reportes');
    if (!fs.existsSync(carpetaDestino)) {
      fs.mkdirSync(carpetaDestino, { recursive: true });
    }
    const rutaArchivoFisico = path.join(carpetaDestino, nombreArchivo);

    // Canalizar la salida de datos simultáneamente hacia el disco local y a la respuesta HTTP
    const streamArchivo = fs.createWriteStream(rutaArchivoFisico);
    doc.pipe(streamArchivo);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${nombreArchivo}`);
    doc.pipe(res);

    // 4. Maquetación y estructura visual del PDF corporativo
    doc.fillColor('#1e1e2d').fontSize(22).text('NEXUS-INVENTORY - REPORTE CORPORATIVO', { align: 'center' });
    doc.moveDown(0.5);
    doc.strokeColor('#e4e6ef').moveTo(50, doc.y).lineTo(562, doc.y).stroke();
    doc.moveDown();

    doc.fillColor('#181c32').fontSize(12).text(`Organización: ${empresaFiltro}`, { font: 'Helvetica-Bold' });
    doc.text(`Fecha y Hora de Emisión: ${new Date().toLocaleString()}`);
    doc.moveDown(1.5);

    // Sección A: Consolidado de Ventas
    doc.fillColor('#3699ff').fontSize(15).text('1. Métricas Consolidadas de Ventas', { underline: false });
    doc.moveDown(0.5);
    doc.fillColor('#5e6278').fontSize(11);

    if (datosVenta) {
      doc.text(`• Cantidad de Ventas Totales: ${datosVenta.cantidadVentas}`);
      doc.text(`• Volumen de Ingresos Totales: S/. ${datosVenta.ingresosTotales.toFixed(2)}`);
      doc.text(`• Venta Promedio Diaria: S/. ${datosVenta.ventaPromedioDiaria.toFixed(2)}`);
      doc.text(`• Plan de Suscripción Nexus: ${datosVenta.planActual}`);
      doc.text(`• Estado Operacional del Negocio: ${datosVenta.estado}`);
    } else {
      doc.text('No se encontraron registros estadísticos consolidados de ventas para esta empresa.');
    }
    doc.moveDown(2);

    // Sección B: Catálogo de Almacén
    doc.fillColor('#3699ff').fontSize(15).text('2. Catálogo General de Productos en Existencia');
    doc.moveDown(0.5);

    if (listaProductos && listaProductos.length > 0) {
      listaProductos.forEach((prod, indice) => {
        doc.fillColor('#181c32').fontSize(11).text(`${indice + 1}. ${prod.nombre} (${prod.categoria || 'Sin Categoría'})`);
        doc.fillColor('#7e8299').fontSize(10).text(`   Código Barras: ${prod.codigoBarra} | Proveedor: ${prod.proveedor || 'N/A'}`);
        doc.text(`   Stock Disponible: ${prod.stock} u. (Mínimo: ${prod.stockMinimo} u.) | Costo Compra: S/. ${prod.precioCompra.toFixed(2)} | Precio Venta: S/. ${prod.precioVenta.toFixed(2)}`);
        doc.moveDown(0.5);
      });
    } else {
      doc.fillColor('#5e6278').fontSize(11).text('La empresa no registra productos dados de alta en su catálogo actual.');
    }

    // Finalizar el flujo de datos del PDF
    doc.end();

    // 5. Guardar en la tabla reportesPDF tras culminar la escritura física en disco
    streamArchivo.on('finish', async () => {
      try {
        const nuevoReporteLog = new ReportePDF({
          nombreArchivo: nombreArchivo,
          rutaArchivo: `/pdf/reportes/${nombreArchivo}`,
          fechaGeneracion: new Date()
        });
        await nuevoReporteLog.save();
      } catch (logError) {
        console.error('🔴 Error registrando metadata en reportesPDF:', logError.message);
      }
    });

  } catch (error) {
    console.error('🔴 Error crítico procesando PDF:', error);
    if (!res.headersSent) {
      res.status(500).json({ mensaje: 'Error al procesar la exportación del documento PDF', error: error.message });
    }
  }
};