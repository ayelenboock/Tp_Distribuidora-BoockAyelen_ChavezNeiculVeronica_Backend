import productosModel from '../models/productosModels.js';
class ProductosController {
    constructor() { }
    //GET
    async consultar(req, res) {
        const [filas] = await productosModel.obtenerTodos();
        res.status(200).json({
            total: filas.length,
            productos: filas
        });
    }
    //GET productos filtrados por categoría
    async consultarPorCategoria(req, res) {
        const [filas] = await productosModel.obtenerPorCategoria(req.params.id);
        res.status(200).json({ total: filas.length, productos: filas });
    }
    //GET estadísticas por categoría
    async estadisticas(req, res) {
        const [filas] = await productosModel.obtenerEstadisticas();
        res.status(200).json({ estadisticas: filas });
    }
    //POST
    async ingresar(req, res) {
        const { id_categoria, id_proveedor, nombre_producto, descripcion, precio, stock } = req.body;
        if (!id_categoria || !id_proveedor || !nombre_producto || !descripcion || precio === undefined) {
            return res.status(400).json({ error: 'faltan campos obligatorios' });
        }
        const [resultado] = await productosModel.crear({ id_categoria, id_proveedor, nombre_producto, descripcion, precio, stock });
        res.status(201).json({
            mensaje: 'Producto creado con éxito',
            id: resultado.insertId
        });
    }
    //GET id
    async consultarDetalle(req, res) {
        const { id } = req.params;
        const [filas] = await productosModel.obtenerPorId(id);
        if (filas.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json(filas[0]);
    }
    //PUT
    async actualizar(req, res) {
        const { id } = req.params;
        const { id_categoria, id_proveedor, nombre_producto, descripcion, precio, stock } = req.body;
        if (!id_categoria || !id_proveedor || !nombre_producto || !descripcion || precio === undefined || stock === undefined) {
            return res.status(400).json({ error: 'faltan campos obligatorios' });
        }
        const [resultado] = await productosModel.actualizar(id, { id_categoria, id_proveedor, nombre_producto, descripcion, precio, stock });
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        const [filas] = await productosModel.obtenerPorId(id);
        res.status(200).json({
            mensaje: 'Producto actualizado con éxito',
            producto: filas[0]
        });
    }
    //PATCH
    async actualizarParcial(req, res) {
        const { id } = req.params;
        const campos = req.body;
        if (!campos || Object.keys(campos).length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
        }
        //`UPDATE 
        const [resultado] = await productosModel.actualizarParcial(id, campos);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        const [filas] = await productosModel.obtenerPorId(id);
        res.status(200).json({
            mensaje: 'Producto actualizado con éxito',
            producto: filas[0]
        });
    }
    ;
    async eliminar(req, res) {
        const { id } = req.params;
        const [resultado] = await productosModel.eliminar(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ mensaje: 'Producto eliminado con éxito' });
    }
}
export default new ProductosController();
//# sourceMappingURL=productosControllers.js.map