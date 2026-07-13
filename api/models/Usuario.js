const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
    correo: { type: String, required: true, unique: true, lowercase: true },
    empresa: { type: String, required: true, lowercase: true }, // Se normaliza en minúsculas para evitar errores tipográficos
    estado: { type: Boolean, default: true },
    fechaRegistro: { type: Date, default: Date.now },
    intentosFallidos: { type: Number, default: 0 },
    nombre: { type: String, required: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ['usuario', 'admin', 'superadmin'], required: true },
    ultimoAcceso: { type: Date }
});

usuarioSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return; 
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar la contraseña ingresada con la encriptada
usuarioSchema.methods.compararPassword = async function(passwordIngresado) {
    return await bcrypt.compare(passwordIngresado, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema, 'usuarios'); 