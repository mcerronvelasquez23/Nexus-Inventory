const { GoogleGenerativeAI } = require('@google/generative-ai');
const jwt = require('jsonwebtoken');

const Producto = require('../models/Producto');
const Venta = require('../models/Venta');

exports.consultarIA = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ mensaje: 'Token requerido.' });

    const token = authHeader.split(' ')[1];
    const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_super_segura');
    
    const empresaFiltro = decodificado.empresa;
    const regexEmpresa = new RegExp(`^${empresaFiltro}$`, 'i');

    const { pregunta } = req.body;
    if (!pregunta) return res.status(400).json({ mensaje: 'Debes formular una pregunta.' });

    // 1. OBTENER VENTAS GLOBALES
    const datosVentas = await Venta.findOne({ empresa: regexEmpresa });

    // 2. OBTENER PRODUCTOS CON BAJO STOCK
    // CAMBIO VITAL: Usar empresaId en lugar de empresa
    const productosBajoStock = await Producto.find({ 
      empresaId: regexEmpresa, 
      $expr: { $lte:  ["$stock", "$stockMinimo"] }
    }).limit(10).select('nombre stock stockMinimo'); 

    // 3. BUSCAR EL PRODUCTO ESPECÍFICO (Limpiando puntuación)
    // Esto elimina signos como ¿ ? ¡ ! , . antes de procesar
    const preguntaLimpia = pregunta.replace(/[^\w\sáéíóúüñ]/gi, ' ');

    const palabras = preguntaLimpia.split(' ')
      .filter(p => p.trim().length > 3)
      .map(p => p.toLowerCase())
      .map(p => p.endsWith('s') ? p.slice(0, -1) : p);

    const regexBusqueda = palabras.map(p => new RegExp(p, 'i'));

    // CAMBIO VITAL: Usar empresaId en lugar de empresa
    const productosBuscados = await Producto.find({
      empresaId: regexEmpresa, 
      nombre: { $in: regexBusqueda } 
    }).limit(5).select('nombre stock stockMinimo');

    // 🔴 MODO DEBUG: Esto imprimirá en tu terminal qué está buscando exactamente
    console.log("Palabras clave extraídas:", palabras);
    console.log("Productos encontrados por Mongoose:", productosBuscados);

    // 4. CONSTRUIR CONTEXTO CON LAS DOS SECCIONES de INVENTARIO
    let contextoBD = `Eres "Nexus IA", el asistente virtual de la empresa "${empresaFiltro}". 
    REGLAS DE COMPORTAMIENTO ESTRICTAS:
    1. Responde de forma MUY breve, concisa y directa (máximo 2 párrafos).
    2. NO uses formato Markdown. NO uses asteriscos (*), ni negritas, ni cursivas. Escribe todo en texto plano.
    3. Si el usuario pregunta por un producto que NO está en ninguna de las listas de abajo, responde EXACTAMENTE: "No dispongo de la información de ese producto en este momento." No intentes adivinar el stock.
    4. Usa EXCLUSIVAMENTE esta base de datos para responder:\n\n`;

    if (datosVentas) {
      contextoBD += `--- VENTAS GLOBALES ---\n`;
      contextoBD += `Totales: ${datosVentas.cantidadVentas} | Ingresos: S/.${datosVentas.ingresosTotales}\n\n`;
    }

    contextoBD += `--- PRODUCTOS CON STOCK CRÍTICO ---\n`;
    if (productosBajoStock.length > 0) {
      productosBajoStock.forEach(p => {
        contextoBD += `- ${p.nombre}: ${p.stock} u. (Mínimo: ${p.stockMinimo})\n`;
      });
    } else {
      contextoBD += `Todo el stock está en niveles seguros.\n`;
    }

    contextoBD += `\n--- INFORMACION DE PRODUCTOS SOLICITADOS ---\n`;
    if (productosBuscados.length > 0) {
      productosBuscados.forEach(p => {
        contextoBD += `- ${p.nombre}: ${p.stock} u. (Mínimo: ${p.stockMinimo})\n`;
      });
    } else {
      contextoBD += `No se encontraron productos específicos que coincidan con la búsqueda.\n`;
    }

    contextoBD += `\nPREGUNTA DEL USUARIO: "${pregunta}"\n`;

    console.log("\n=== NUEVO CONTEXTO ENVIADO A GEMINI ===");
    console.log(contextoBD);
    console.log("=================================\n");

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: contextoBD }] }],
        generationConfig: { maxOutputTokens: 250, temperature: 0.7 }
      });

      const respuestaIA = result.response.candidates[0].content.parts[0].text;
      return res.json({ respuesta: respuestaIA });

    } catch (aiError) {
      console.error('🔴 Error directo de Google Gemini API:', aiError.message);
      return res.status(502).json({ mensaje: 'Error de comunicación con la IA.', error: aiError.message });
    }

  } catch (error) {
    console.error('🔴 Error en el servidor Chatbot:', error);
    return res.status(500).json({ mensaje: 'Error interno al recopilar datos.', error: error.message });
  }
};