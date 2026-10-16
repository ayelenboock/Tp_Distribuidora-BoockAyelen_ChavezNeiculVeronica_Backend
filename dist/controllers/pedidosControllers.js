import PedidosModel from '../models/pedidosModels.js';
class PedidosController {
    constructor() { }
    //GET
    async consultar(req, res) {
        const [filas] = await PedidosModel.obtenerTodos();
        res.status(200).json({
            total: filas.length,
            pedidos: filas
        });
    }
    //POST
    async ingresar(req, res) {
        const { id_cliente, id_empleado, id_compania, total, estado } = req.body;
        if (!id_cliente || !id_empleado || !id_compania || total === undefined) {
            return res.status(400).json({ error: 'faltan campos obligatorios' });
        }
        const [resultado] = await PedidosModel.crear({ id_cliente, id_empleado, id_compania, total, estado });
        res.status(201).json({
            mensaje: 'Pedido creado con éxito',
            id: resultado.insertId
        });
    }
    // GET estado
    async consultarPorEstado(req, res) {
        const [filas] = await PedidosModel.obtenerPorEstado(req.params.estado);
        res.status(200).json({ total: filas.length, pedidos: filas });
    }
    //GET estadisticas
    async estadisticas(req, res) {
        const [filas] = await PedidosModel.obtenerEstadisticas();
        res.status(200).json({ estadisticas: filas });
    }
    //GET id
    async consultarDetalle(req, res) {
        const { id } = req.params;
        const [pedidos] = await PedidosModel.obtenerPorId(id);
        if (pedidos.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        const [productos] = await PedidosModel.obtenerDetalle(id);
        res.status(200).json({
            ...pedidos[0],
            productos: productos
        });
    }
    //PUT
    async actualizar(req, res) {
        const { id } = req.params;
        const { id_cliente, id_empleado, id_compania, total, estado } = req.body;
        if (!id_cliente || !id_empleado || !id_compania || total === undefined || !estado) {
            return res.status(400).json({ error: 'faltan campos obligatorios' });
        }
        const [resultado] = await PedidosModel.actualizar(id, { id_cliente, id_empleado, id_compania, total, estado });
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        const [filas] = await PedidosModel.obtenerPorId(id);
        res.status(200).json({
            mensaje: 'Pedido actualizado con éxito',
            pedido: filas[0]
        });
    }
    //PATCH
    async actualizarParcial(req, res) {
        const { id } = req.params;
        const campos = req.body;
        if (!campos || Object.keys(campos).length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
        }
        const [resultado] = await PedidosModel.actualizarParcial(id, campos);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        const [filas] = await PedidosModel.obtenerPorId(id);
        res.status(200).json({
            mensaje: 'Pedido actualizado con éxito',
            pedido: filas[0]
        });
    }
    ;
    async eliminar(req, res) {
        const { id } = req.params;
        const [resultado] = await PedidosModel.eliminar(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.status(200).json({ mensaje: 'Pedido eliminado con éxito' });
    }
}
export default new PedidosController();
//# sourceMappingURL=pedidosControllers.js.map