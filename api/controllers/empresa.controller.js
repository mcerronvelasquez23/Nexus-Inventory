const Usuario = require('../models/Usuario');


// GET: Listar empresas únicas agrupadas con su conteo de usuarios
exports.listarEmpresasGlobal = async (req, res) => {
    try {
        const empresas = await Usuario.aggregate([
            { 
                $group: { 
                    _id: '$empresa', 
                    totalUsuarios: { $sum: 1 } 
                } 
            },
            { 
                $sort: { _id: 1 } 
            }
        ]);
        
        return res.status(200).json(empresas);
    } catch (error) {
        return res.status(500).json({ 
            mensaje: 'Error al cargar el catálogo de empresas.', 
            error: error.message 
        });
    }
};

// DELETE: Eliminar masivamente a TODOS los usuarios de una empresa específica
exports.eliminarEmpresaGlobal = async (req, res) => {
    try {
        const nombreEmpresa = req.params.nombre.toLowerCase();
        
        const resultado = await Usuario.deleteMany({ empresa: nombreEmpresa });
        
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron usuarios para esta empresa.' });
        }

        return res.status(200).json({ 
            mensaje: `Se ha eliminado la empresa y sus ${resultado.deletedCount} usuarios de forma permanente.` 
        });
    } catch (error) {
        return res.status(500).json({ 
            mensaje: 'Error al purgar la empresa.', 
            error: error.message 
        });
    }
};