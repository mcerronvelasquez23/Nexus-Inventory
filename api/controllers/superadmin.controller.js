const Usuario = require('../models/Usuario');
const PlanVenta = require('../models/PlanVenta');
const HistorialPlanVenta = require('../models/HistorialPlanVenta'); // Asegúrate de usarlos si son necesarios
const DetallePlanVenta = require('../models/DetallePlanVenta');

// Función 1 - KPIs (Corregida para excluir superadmins y calcular totales)
const obtenerKPIs = async () => {
        const [
            totalUsuarios,
            totalEmpresas,
            totalVentas,
            ingresos
        ] = await Promise.all([
            // Excluimos a los superadmin del conteo de usuarios
            Usuario.countDocuments({ rol: { $ne: 'superadmin' } }), 
            
            // Excluimos a los superadmin al buscar empresas únicas
            Usuario.distinct('empresa', { rol: { $ne: 'superadmin' } }), 
            
            // Total de ventas en la tabla planes_ventas
            PlanVenta.countDocuments(), 
            
            // Suma de todos los ingresos en planes_ventas
            PlanVenta.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$total' }
                    }
                }
            ])
        ]);
    
        return {
            totalUsuarios,
            totalEmpresas: totalEmpresas.length, // .distinct() devuelve un array, tomamos la longitud
            totalVentas,
            ingresosTotales: ingresos.length > 0 ? ingresos[0].total.toFixed(2) : 0 // Formateado a 2 decimales
        };
    };

    // Función 2 - Lista de usuarios
    const obtenerUsuarios = async () => {
        return await Usuario
            .find({ rol: { $ne: 'superadmin' } }, { // Excluimos también de la tabla
                password: 0,
                __v: 0
            })
            .sort({ fechaRegistro: -1 });
    };
    
    // Función 3 - Usuarios por rol
    const usuariosPorRol = async () => {
        return await Usuario.aggregate([
            { $match: { rol: { $ne: 'superadmin' } } }, // Opcional: ocultar superadmin del gráfico
            {
                $group: {
                    _id: '$rol',
                    total: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ]);
    };
    
    // Función 4 - Planes vendidos
    const planesVendidos = async () => {
        return await PlanVenta.aggregate([
            {
                $group: {
                    _id: '$plan',
                    cantidad: { $sum: 1 },
                    ingresos: { $sum: '$total' }
                }
            },
            { $sort: { cantidad: -1 } }
        ]);
    };
    
    // Función 5 - Métodos de pago
    const metodosPago = async () => {
        return await PlanVenta.aggregate([
            {
                $group: {
                    _id: '$metodoPago',
                    total: { $sum: 1 }
                }
            }
        ]);
    };
    
    // Función 6 - Estado de ventas
    const estadoVentas = async () => {
        return await PlanVenta.aggregate([
            {
                $group: {
                    _id: '$estado',
                    total: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ]);
    };
    
    // Función 7 - Ventas por mes
    const ventasPorMes = async () => {
        return await PlanVenta.aggregate([
            {
                $group: {
                    _id: {
                        anio: { $year: '$fechaPago' },
                        mes: { $month: '$fechaPago' }
                    },
                    cantidad: { $sum: 1 }
                }
            },
            { $sort: { "_id.anio": 1, "_id.mes": 1 } }
        ]);
    };
    
    // Función 8 - Ingresos por mes
    const ingresosPorMes = async () => {
        return await PlanVenta.aggregate([
            {
                $group: {
                    _id: {
                        anio: { $year: '$fechaPago' },
                        mes: { $month: '$fechaPago' }
                    },
                    ingresos: { $sum: '$total' }
                }
            },
            { $sort: { "_id.anio": 1, "_id.mes": 1 } }
        ]);
    };
    
    // Función 9 - Top empresas
    const topEmpresas = async () => {
        return await PlanVenta.aggregate([
            {
                $group: {
                    _id: '$ventaEmpresa',
                    totalCompras: { $sum: 1 },
                    monto: { $sum: '$total' }
                }
            },
            { $sort: { monto: -1 } },
            { $limit: 10 }
        ]);
    };
    
    // Función 10 - Historial Ventas
    const historialVentas = async () => {
        return await PlanVenta.find()
            .sort({ fechaPago: -1 })
            .limit(100);
    };

// Export principal CORREGIDO
    exports.obtenerDashboard = async (req, res) => {
       try {
            // Ahora las 10 variables coinciden exactamente con las 10 funciones ejecutadas
            const [
                kpis,
                usuarios,
                usuariosRolData,
                planesData,
                metodosData,
                estadosData,
                ventasMesData,
                ingresosMesData,
                empresasTopData,
                historial
            ] = await Promise.all([
                obtenerKPIs(),
                obtenerUsuarios(),
                usuariosPorRol(),
                planesVendidos(),
                metodosPago(),
                estadoVentas(),
                ventasPorMes(),
                ingresosPorMes(),
                topEmpresas(),
                historialVentas()
            ]);
          res.json({
             success: true,
             data: {
                kpis,
                usuarios,
                historial,
                graficos: {
                    // Estos nombres ahora coinciden EXACTAMENTE con tu superadmin.ts en Angular
                    usuariosRol: usuariosRolData,
                    planesVendidos: planesData,    
                    metodosPago: metodosData,            
                    estadosVenta: estadosData,
                    ventasMensuales: ventasMesData,          
                    ingresosMensuales: ingresosMesData,     
                    empresasTop: empresasTopData
                }
             }
          });
       } catch(error) {
          console.error("Error al cargar dashboard:", error);
          res.status(500).json({
             success: false,
             mensaje: error.message
          });
       };
    
       exports.listarUsuariosGlobal = async (req, res) => {
        try {
            const usuarios = await Usuario.find({}, { password: 0, __v: 0 }).sort({ fechaRegistro: -1 });
            return res.status(200).json(usuarios);
        } catch (error) {
            return res.status(500).json({ mensaje: 'Error al recuperar el ecosistema global de usuarios.', error: error.message });
        }
    };
    
    // Crear un nuevo usuario forzando estrictamente el rol 'superadmin'
    exports.crearSuperadmin = async (req, res) => {
        try {
            const { correo, nombre, password, empresa } = req.body;
    
            if (!correo || !nombre || !password || !empresa) {
                return res.status(400).json({ mensaje: 'Todos los campos son estrictamente obligatorios.' });
            }
    
            const usuarioExistente = await Usuario.findOne({ correo: correo.toLowerCase() });
            if (usuarioExistente) {
                return res.status(400).json({ mensaje: 'El correo electrónico ya se encuentra registrado en el sistema.' });
            }
    
            const nuevoSuperadmin = new Usuario({
                correo,
                nombre,
                password,
                rol: 'superadmin', 
                empresa: empresa.trim().toLowerCase(),
                estado: true,
                intentosFallidos: 0,
                fechaRegistro: new Date()
            });
    
            await nuevoSuperadmin.save();
            const respuesta = nuevoSuperadmin.toObject();
            delete respuesta.password;
    
            return res.status(201).json(respuesta);
        } catch (error) {
            return res.status(500).json({ mensaje: 'Error de servidor al registrar al superadmin.', error: error.message });
        }
    };

    exports.desbloquearUsuario = async (req, res) => {
        try {
            const { id } = req.params;
            const usuarioActualizado = await Usuario.findByIdAndUpdate(
                id,
                { $set: { intentosFallidos: 0, estado: true } },
                { new: true }
            ).select('-password');
    
            if (!usuarioActualizado) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
            }
    
            return res.status(200).json({ mensaje: 'Cuenta restablecida y desbloqueada con éxito.', usuario: usuarioActualizado });
        } catch (error) {
            return res.status(500).json({ mensaje: 'Error al procesar el desbloqueo técnico.', error: error.message });
        }
    };

    exports.eliminarUsuarioGlobal = async (req, res) => {
        try {
            const { id } = req.params;
            
            if (id === req.usuarioId) { 
                return res.status(400).json({ mensaje: 'Operación inválida. No es posible auto-eliminarse de la plataforma.' });
            }
    
            const resultado = await Usuario.deleteOne({ _id: id });
            if (resultado.deletedCount === 0) {
                return res.status(404).json({ mensaje: 'El usuario no existe o ya ha sido removido.' });
            }
    
            return res.status(200).json({ mensaje: 'Perfil purgado del ecosistema de manera absoluta.' });
        } catch (error) {
                return res.status(500).json({ mensaje: 'Error al remover el perfil.', error: error.message });
            }   
    };
}