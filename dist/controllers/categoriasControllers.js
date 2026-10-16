import CategoriasModel from '../models/categoriasModels.js';
class CategoriasController {
    constructor() { }
    //Creamos los métodos para reemplazar las funciones en Routes
    //GET
    async consultar(req, res) {
        const [filas] = await CategoriasModel.obtenerTodos();
        res.status(200).json({
            total: filas.length,
            categorias: filas
        });
    }
    //GET categorías por nombre
    async buscar(req, res) {
        const [filas] = await CategoriasModel.buscarPorNombre(req.params.texto);
        res.status(200).json({ total: filas.length, categorias: filas });
    }
    //GET estadísticas: unidades vendidas por categoría
    async estadisticas(req, res) {
        const [filas] = await CategoriasModel.obtenerEstadisticas();
        res.status(200).json({ estadisticas: filas });
    }
    //POST
    async ingresar(req, res) {
        const { nombre, descripcion } = req.body;
        if (!nombre || !descripcion) {
            return res.status(400).json({ error: 'faltan campos obligatorios' });
        }
        const [resultado] = await CategoriasModel.crear({ nombre, descripcion });
        res.status(201).json({
            mensaje: 'Categoría creada con éxito',
            id: resultado.insertId
        });
    }
    //GET id
    async consultarDetalle(req, res) {
        const { id } = req.params;
        const [filas] = await CategoriasModel.obtenerPorId(id);
        if (filas.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json(filas[0]);
    }
    //PUT
    async actualizar(req, res) {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        if (!nombre || !descripcion) {
            return res.status(400).json({ error: 'faltan campos obligatorios' });
        }
        const [resultado] = await CategoriasModel.actualizar(id, { nombre, descripcion });
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        const [filas] = await CategoriasModel.obtenerPorId(id);
        res.status(200).json({
            mensaje: 'Categoría actualizada con éxito',
            categoria: filas[0]
        });
    }
    //PATCH
    async actualizarParcial(req, res) {
        const { id } = req.params;
        const campos = req.body;
        if (!campos || Object.keys(campos).length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
        }
        const [resultado] = await CategoriasModel.actualizarParcial(id, campos);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        const [filas] = await CategoriasModel.obtenerPorId(id);
        res.status(200).json({
            mensaje: 'Categoría actualizada con éxito',
            categoria: filas[0]
        });
    }
    ;
    async eliminar(req, res) {
        const { id } = req.params;
        const [resultado] = await CategoriasModel.eliminar(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json({ mensaje: 'Categoría eliminada con éxito' });
    }
}
export default new CategoriasController();
//# sourceMappingURL=categoriasControllers.js.map