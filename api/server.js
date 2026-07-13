// Cargar variables de entorno al inicio
require('dotenv').config();
console.log('JWT_SECRET =', process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');

// Importar nuestras configuraciones de BD
const connectMongo = require('./config/mongo');
const { connectRedis } = require('./config/redis');

// Importar Rutas
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes'); // Importamos tu nueva ruta
const planVentaRoutes = require('./routes/planVenta.routes');
const productoRoutes = require('./routes/producto.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const proveedorRoutes = require('./routes/proveedor.routes');
const ventasRoutes = require('./routes/ventas.routes');
const reporteRoutes = require('./routes/reporte.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const escanerRoutes = require('./routes/escaner.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const superadminRoutes = require('./routes/superadmin.routes');
const empresaRoutes = require('./routes/empresa.routes');
const superadminUsuarioRoutes = require('./routes/superadmin-usuario.routes');
const superadminVentaRoutes = require('./routes/superadmin-venta.routes');
const superadminHistorialRoutes = require('./routes/superadmin-historial.routes');
const path = require('path');
const app = express();

// 1. MIDDLEWARES GLOBALES 
app.use(cors());         // Permite conexiones desde Angular (localhost:4200)
app.use(express.json()); // Permite que Express entienda JSON en el req.body
app.use('/pdf', express.static(path.join(__dirname, 'public/pdf')));

// 2. RUTAS DE LA API
app.use('/api/productos', productoRoutes); //ruta productos
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes); // Conectamos la ruta del dashboard
app.use('/api/categorias', categoriaRoutes); //ruta categorias
app.use('/api/ventas', ventasRoutes); //ruta ventas
app.use('/api/proveedores', proveedorRoutes); //ruta proveedores
app.use('/api/reportes', reporteRoutes); //ruta reportes
app.use('/api/usuarios', usuarioRoutes); //ruta usuarios
app.use('/api/escaner', escanerRoutes); //ruta escaner
app.use('/api/chatbot', chatbotRoutes); //ruta chatbot
app.use('/api/plan-venta', planVentaRoutes); //ruta plan de ventas
app.use('/api/superadmin/empresas', empresaRoutes);
app.use('/api/superadmin/usuarios', superadminUsuarioRoutes);
app.use('/api/superadmin/ventas', superadminVentaRoutes);
app.use('/api/superadmin/historial', superadminHistorialRoutes);

app.use('/api/superadmin', superadminRoutes);

// Ruta base para comprobar estado
app.get('/api/status', (req, res) => {
    res.json({ message: 'Nexus Inventory API funcionando correctamente 🚀' });
});

// 3. INICIALIZACIÓN DEL SERVIDOR
const startServer = async () => {
    try {
        // Conectar a MongoDB
        await connectMongo();
        
        // Conectar a Redis
        await connectRedis();

        // Levantar el servidor Express
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('🔴 Error crítico al iniciar la aplicación:', error);
    }
};

startServer(); 