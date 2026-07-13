const PlanVenta = require('../models/PlanVenta');

exports.registrarPago = async (req, res) => {
  try {
    // 1. Imprime los datos que llegan de Angular para verificar que no haya "undefined"
    console.log("==> Datos recibidos para PlanVenta:", req.body); 

    const nuevaVenta = new PlanVenta({
      numeroVenta: req.body.numeroVenta,
      ventaEmpresa: req.body.ventaEmpresa.trim().toLowerCase(), // Limpiamos espacios
      plan: req.body.plan,
      periodo: req.body.periodo,
      subtotal: Number(req.body.subtotal),
      igv: Number(req.body.igv),
      total: Number(req.body.total),
      metodoPago: req.body.metodoPago,
      estado: req.body.estado
    });

    await nuevaVenta.save();
    
    res.status(201).json({ 
      mensaje: 'Pago registrado exitosamente en MongoDB', 
      venta: nuevaVenta 
    });
  } catch (error) {
    // 2. Si falla el modelo de Mongoose, imprimimos el error exacto
    console.error("==> Error fatal en MongoDB:", error.message);
    res.status(500).json({ 
      mensaje: 'Error al registrar el pago', 
      error: error.message 
    });
  }
};