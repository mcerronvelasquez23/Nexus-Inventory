const mongoose = require('mongoose');

const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🟢 Conectado exitosamente a MongoDB');
    } catch (error) {
        console.error('🔴 Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectMongo;