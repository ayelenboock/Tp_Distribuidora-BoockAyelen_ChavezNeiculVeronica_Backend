import CompaniasEnvioModel from '../models/companiasEnvioModels.js';
class CompaniasEnvioController {
    constructor() { }
    //GET
    async consultar(req, res) {
        const [filas] = await CompaniasEnvioModel.obtenerTodos();
        res.status(200).json({
            total: filas.length,
            companias: filas
        });
    }
    //GET compañías por nombre
    async buscar(req, res) {
        const [filas] = await CompaniasEnvioModel.buscarPorNombre(req.params.texto);
        res.status(200).json({ total: filas.length, companias: filas });
    }
    //GET envíos por compañía
    async estadisticas(req, res) {
        const [filas] = await CompaniasEnvioModel.obtenerEstadisticas();
        res.status(200).json({ estadisticas: filas });
    }
    //POST
    async ingresar(req, res) {
        const { nombre, telefono, direccion } = req.body;
        if (!nombre || !telefono || !direccion) {
            return res.status(400).json({ error: 'Faltan Campos Obligatorios' });
        }
        const [resultado] = await CompaniasEnvioModel.crear({ nombre, telefono, direccion });
        res.status(201).json({
            mensaje: 'Compañía de envio creada con éxito',
            id: resultado.insertId //mandar el ID
        });
    }
    //GET id
    async consultarDetalle(req, res) {
        const { id } = req.params;
        const [filas] = await CompaniasEnvioModel.obtenerPorId(id);
        if (filas.length === 0) {
            return res.status(404).json({ error: 'Compañía de envio no encontrada' });
        }
        res.status(200).json(filas[0]);
    }
    //PUT
    async actualizar(req, res) {
        const { id } = req.params;
        const { nombre, telefono, direccion } = req.body;
        if (!nombre || !telefono || !direccion) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const [resultado] = await CompaniasEnvioModel.actualizar(id, { nombre, telefono, direccion });
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Compañía de envio no encontrada' });
        }
        const [filas] = await CompaniasEnvioModel.obtenerPorId(id);
        res.status(200).json({
            mensaje: 'Compañía de envio actualizada con éxito',
            compania: filas[0]
        });
    }
    //PATCH
    async actualizarParcial(req, res) {
        const { id } = req.params;
        const campos = req.body;
        if (!campos || Object.keys(campos).length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
        }
        const [resultado] = await CompaniasEnvioModel.actualizarParcial(id, campos);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Compañía de envio no encontrada' });
        }
        const [filas] = await CompaniasEnvioModel.obtenerPorId(id);
        res.status(200).json({
            mensaje: 'Compañía de envio actualizada con éxito',
            compania: filas[0]
        });
    }
    ;
    async eliminar(req, res) {
        const { id } = req.params;
        const [resultado] = await CompaniasEnvioModel.eliminar(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Compañía de envio no encontrada' });
        }
        res.status(200).json({ mensaje: 'Compañía de envio eliminada con éxito' });
    }
}
export default new CompaniasEnvioController();
//# sourceMappingURL=companiasEnvioControllers.js.map