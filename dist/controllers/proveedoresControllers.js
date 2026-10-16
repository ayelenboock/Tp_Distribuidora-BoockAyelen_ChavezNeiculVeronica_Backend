import ProveedoresModel from '../models/proveedoresModels.js';
class ProveedoresController {
    constructor() { }
    //GET
    async consultar(req, res) {
        const [filas] = await ProveedoresModel.obtenerTodos();
        res.status(200).json({
            total: filas.length,
            proveedores: filas
        });
    }
    //GET proveedores filtrados por condición de IVA
    async consultarPorCondicion(req, res) {
        const [filas] = await ProveedoresModel.obtenerPorCondicion(req.params.condicion);
        res.status(200).json({ total: filas.length, proveedores: filas });
    }
    //GET estadísticas: productos y stock por proveedor
    async estadisticas(req, res) {
        const [filas] = await ProveedoresModel.obtenerEstadisticas();
        res.status(200).json({ estadisticas: filas });
    }
    //POST
    async ingresar(req, res) {
        const { razon_social, nombre_contacto, telefono, email, direccion, condicion_iva } = req.body;
        if (!razon_social || !nombre_contacto || !telefono || !email || !direccion || !condicion_iva) {
            return res.status(400).json({ error: 'faltan campos obligatorios' });
        }
        const [resultado] = await ProveedoresModel.crear({ razon_social, nombre_contacto, telefono, email, direccion, condicion_iva });
        res.status(201).json({
            mensaje: 'Proveedor creado con éxito',
            id: resultado.insertId
        });
    }
    //GET id
    async consultarDetalle(req, res) {
        const { id } = req.params;
        const [filas] = await ProveedoresModel.obtenerPorId(id);
        if (filas.length === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        res.status(200).json(filas[0]);
    }
    //PUT
    async actualizar(req, res) {
        const { id } = req.params;
        const { razon_social, nombre_contacto, telefono, email, direccion, condicion_iva } = req.body;
        if (!razon_social || !nombre_contacto || !telefono || !email || !direccion || !condicion_iva) {
            return res.status(400).json({ error: 'faltan campos obligatorios' });
        }
        const [resultado] = await ProveedoresModel.actualizar(id, { razon_social, nombre_contacto, telefono, email, direccion, condicion_iva });
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        const [filas] = await ProveedoresModel.obtenerPorId(id);
        res.status(200).json({
            mensaje: 'Proveedor actualizado con éxito',
            proveedor: filas[0]
        });
    }
    //PATCH
    async actualizarParcial(req, res) {
        const { id } = req.params;
        const campos = req.body;
        if (!campos || Object.keys(campos).length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
        }
        const [resultado] = await ProveedoresModel.actualizarParcial(id, campos);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        const [filas] = await ProveedoresModel.obtenerPorId(id);
        res.status(200).json({
            mensaje: 'Proveedor actualizado con éxito',
            proveedor: filas[0]
        });
    }
    ;
    async eliminar(req, res) {
        const { id } = req.params;
        const [resultado] = await ProveedoresModel.eliminar(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        res.status(200).json({ mensaje: 'Proveedor eliminado con éxito' });
    }
}
export default new ProveedoresController();
//# sourceMappingURL=proveedoresControllers.js.map