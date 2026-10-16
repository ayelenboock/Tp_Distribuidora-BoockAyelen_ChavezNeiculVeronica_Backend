import ClientesModel from '../models/clientesModels.js';
class ClientesController {
    constructor() { }
    //GET
    async consultar(req, res) {
        const [filas] = await ClientesModel.obtenerTodos();
        res.status(200).json({
            total: filas.length,
            clientes: filas
        });
    }
    //GET clientes filtrados por condición de IVA
    async consultarPorCondicion(req, res) {
        const [filas] = await ClientesModel.obtenerPorCondicion(req.params.condicion);
        res.status(200).json({ total: filas.length, clientes: filas });
    }
    //GET estadísticas: pedidos y total comprado por cliente
    async estadisticas(req, res) {
        const [filas] = await ClientesModel.obtenerEstadisticas();
        res.status(200).json({ estadisticas: filas });
    }
    //POST
    async ingresar(req, res) {
        const { nombre, apellido, cuit, razon_social, direccion, telefono, email, dni, condicion_iva } = req.body;
        if (!nombre || !apellido || !cuit || !razon_social || !direccion || !telefono || !email || !dni || !condicion_iva) {
            return res.status(400).json({ error: 'Faltan Campos Obligatorios' });
        }
        const [resultado] = await ClientesModel.crear({ nombre, apellido, cuit, razon_social, direccion, telefono, email, dni, condicion_iva });
        res.status(201).json({
            mensaje: 'Cliente creado con éxito',
            id: resultado.insertId //mandar el ID
        });
    }
    //GET id
    async consultarDetalle(req, res) {
        const { id } = req.params;
        const [filas] = await ClientesModel.obtenerPorId(id);
        if (filas.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json(filas[0]);
    }
    //PUT
    async actualizar(req, res) {
        const { id } = req.params;
        const { nombre, apellido, cuit, razon_social, direccion, telefono, email, dni, condicion_iva } = req.body;
        if (!nombre || !apellido || !cuit || !razon_social || !direccion || !telefono || !email || !dni || !condicion_iva) {
            return res.status(400).json({ error: 'faltan campos obligatorios' });
        }
        const [resultado] = await ClientesModel.actualizar(id, { nombre, apellido, cuit, razon_social, direccion, telefono, email, dni, condicion_iva });
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        const [filas] = await ClientesModel.obtenerPorId(id);
        res.status(200).json({
            mensaje: 'Cliente actualizado con éxito',
            cliente: filas[0]
        });
    }
    //PATCH
    async actualizarParcial(req, res) {
        const { id } = req.params;
        const campos = req.body;
        //Obtener las claves y valores enviados en el body
        const keys = Object.keys(campos);
        if (keys.length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
        }
        //Construimos la consulta SQL dinámicamente
        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const values = keys.map(key => campos[key]);
        values.push(id); // Agregamos el id al final de los valores del array para la cláusula WHERE
        //`UPDATE 
        const [resultado] = await ClientesModel.actualizarParcial(id, campos);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        const [filas] = await ClientesModel.obtenerPorId(id);
        res.status(200).json({
            mensaje: 'Cliente actualizado con éxito',
            cliente: filas[0]
        });
    }
    ;
    async eliminar(req, res) {
        const { id } = req.params;
        const [resultado] = await ClientesModel.eliminar(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json({ mensaje: 'Cliente eliminado con éxito' });
    }
}
export default new ClientesController();
//# sourceMappingURL=clientesControllers.js.map