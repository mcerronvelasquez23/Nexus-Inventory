const jwt = require('jsonwebtoken');
const { redisClient } = require('../config/redis'); // Importamos Redis igual que en tu auth.controller

// 1. Middleware para verificar que el usuario tenga un token válido
exports.verificarToken = async (req, res, next) => {
    try {
        // Obtenemos el token de las cabeceras (headers) de la petición HTTP
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado o formato inválido.' });
        }

        // Separamos la palabra "Bearer" del token en sí
        const token = authHeader.split(' ')[1];

        // Decodificamos el token usando la misma clave secreta de tu auth.controller
        const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_super_segura');

        // (OPCIONAL PERO RECOMENDADO) Validar la sesión activa en Redis
        // Si el usuario cerró sesión o lo expulsamos, el token ya no estará en Redis aunque el JWT siga siendo matemáticamente válido
        if (redisClient && redisClient.isOpen) {
            const tokenEnRedis = await redisClient.get(`session:${decodificado.id}`);
            if (!tokenEnRedis || tokenEnRedis !== token) {
                return res.status(401).json({ mensaje: 'Sesión expirada o invalidada en el servidor.' });
            }
        }

        // Guardamos los datos decodificados en la petición (req) para que el controlador los pueda usar
        req.usuario = decodificado;
        req.usuarioId = decodificado.id; // Esto es crucial para evitar que el superadmin se auto-elimine en el controlador que hicimos antes

        // Permitimos que la petición continúe hacia el siguiente paso
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido o expirado.', error: error.message });
    }
};

// 2. Middleware para verificar que el usuario tenga el rol específico de superadmin
exports.esSuperAdmin = (req, res, next) => {
    // Verificamos por seguridad extrema que req.usuario exista (lo crea verificarToken)
    if (!req.usuario) {
        return res.status(500).json({ mensaje: 'Error interno: Imposible validar rol sin autenticación previa.' });
    }

    // Comparamos el rol que venía dentro del payload de tu token
    if (req.usuario.rol !== 'superadmin') {
        return res.status(403).json({ mensaje: 'Acceso denegado. Se requieren privilegios de Super Administrador para esta acción.' });
    }

    // Si efectivamente es superadmin, lo dejamos pasar al controlador
    next();
};