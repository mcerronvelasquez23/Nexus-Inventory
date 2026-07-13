const { createClient } = require('redis');

// Configuramos el cliente con las credenciales del .env
const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

// Eventos para monitorear el estado de Redis
redisClient.on('error', (err) => console.error('🔴 Error en el cliente de Redis:', err));
redisClient.on('connect', () => console.log('🔵 Conectado exitosamente a Redis (WSL)'));

const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('🔴 No se pudo conectar a Redis. Verifica que el servicio esté corriendo en WSL.');
    }
};

// Exportamos tanto la función para conectar, como el cliente para usarlo en los controladores
module.exports = { connectRedis, redisClient };