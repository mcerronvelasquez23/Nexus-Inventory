const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Tu ID personalizado (Firebase)
    codigoBarra: { type: String, required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String },
    empresaId: { type: String, required: true }, 
    categoria: { type: String },
    proveedor: { type: String },
    precioCompra: { type: Number, required: true },
    precioVenta: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    stockMinimo: { type: Number, default: 0 },
    fechaVencimiento: { type: Date },
    imagen: { type: String },
    estado: { type: Boolean, default: true },
    fechaRegistro: { type: Date, default: Date.now }
}, { 
    collection: 'productos', // 🌟 CRÍTICO: Fuerza a Mongoose a leer la colección exacta
    _id: false               // 🌟 Evita que Mongoose intente autogenerar un ObjectId encima del tuyo
});

module.exports = mongoose.model('Producto', productoSchema);