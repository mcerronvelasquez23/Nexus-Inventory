const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const { redisClient } = require('../config/redis'); // Tu conexión a Redis

exports.registrar = async (req, res) => {
    try {
        const { nombre, correo, empresa, password, rol } = req.body;

        // Validar que no exista un usuario con el mismo correo en la misma empresa
        const existeUsuario = await Usuario.findOne({ correo, empresa: empresa.toLowerCase() });
        if (existeUsuario) {
            return res.status(400).json({ mensaje: 'El usuario ya existe en esta empresa' });
        }

        const nuevoUsuario = new Usuario({
        nombre,
        correo: correo.trim().toLowerCase(),
        empresa: empresa.trim().toLowerCase(), 
        password,
        rol: rol.toLowerCase() 
        });

        await nuevoUsuario.save();
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: nuevoUsuario._id });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { correo, empresa, password } = req.body;

        // 1. Buscar al usuario por correo (MongoDB)
        const usuario = await Usuario.findOne({ correo: correo.trim().toLowerCase() });

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Credenciales inválidas' });
        }

        // 2. Lógica del Superusuario vs Usuario Común/Admin
        if (usuario.rol !== 'superadmin' && usuario.empresa !== empresa.toLowerCase()) {
            return res.status(403).json({ mensaje: 'El usuario no pertenece a la empresa indicada' });
        }

        // 3. Verificar si la cuenta está bloqueada
        if (!usuario.estado) {
            return res.status(403).json({ mensaje: 'Cuenta bloqueada por múltiples intentos fallidos. Contacte soporte.' });
        }

        // 4. Validar contraseña
        const passwordValido = await usuario.compararPassword(password);
        if (!passwordValido) {
            // Rastro forense: Aumentar intentos fallidos
            usuario.intentosFallidos += 1;
            if (usuario.intentosFallidos >= 5) {
                usuario.estado = false; // Bloqueo automático por seguridad
            }
            await usuario.save();
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // 5. Autenticación exitosa: Resetear intentos y actualizar último acceso
        usuario.intentosFallidos = 0;
        usuario.ultimoAcceso = Date.now();
        await usuario.save();

        // 6. Generar JWT
        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol, empresa: usuario.empresa },
            process.env.JWT_SECRET || 'clave_secreta_super_segura',
            { expiresIn: '8h' }
        );

        // 7. Guardar sesión en Redis
        await redisClient.setEx(`session:${usuario._id.toString()}`, 28800, token);

        // Devolvemos la respuesta con el rol para que el frontend lo procese
        res.status(200).json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                rol: usuario.rol,
                empresa: usuario.empresa
            }
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el inicio de sesión', error: error.message });
    }
};