import empleadosModel from '../models/empleadosModels.js';
class EmpleadosController {
    constructor() { }
    //GET
    async consultar(req, res) {
        const [filas] = await empleadosModel.obtenerTodos();
        res.status(200).json({
            total: filas.length,
            empleados: filas
        });
    }
    //GET empleados filtrados por puesto
    async consultarPorPuesto(req, res) {
        const [filas] = await empleadosModel.obtenerPorPuesto(req.params.puesto);
        res.status(200).json({ total: filas.length, empleados: filas });
    }
    //GET estadísticas: pedidos y total vendido por empleado
    async estadisticas(req, res) {
        const [filas] = await empleadosModel.obtenerEstadisticas();
        res.status(200).json({ estadisticas: filas });
    }
    //POST
    async ingresar(req, res) {
        const { nombre, apellido, fecha_de_nac, fecha_de_ingreso, dni, cuil, email, puesto } = req.body;
        if (!nombre || !apellido || !fecha_de_nac || !fecha_de_ingreso || !dni || !cuil || !email || !puesto) {
            return res.status(400).json({ error: 'Faltan Campos Obligatorios' });
        }
        const [resultado] = await empleadosModel.crear({ nombre, apellido, fecha_de_nac, fecha_de_ingreso, dni, cuil, email, puesto });
        res.status(201).json({
            mensaje: 'Empleado creado con éxito',
            id: resultado.insertId //mandar el ID
        });
    }
    //GET id
    async consultarDetalle(req, res) {
        const { id } = req.params;
        const [filas] = await empleadosModel.obtenerPorId(id);
        if (filas.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.status(200).json(filas[0]);
    }
    //PUT
    async actualizar(req, res) {
        const { id } = req.params;
        const { nombre, apellido, fecha_de_nac, fecha_de_ingreso, dni, cuil, email, puesto } = req.body;
        if (!nombre || !apellido || !fecha_de_nac || !fecha_de_ingreso || !dni || !cuil || !email || !puesto) {
            return res.status(400).json({ error: 'faltan campos obligatorios' });
        }
        const [resultado] = await empleadosModel.actualizar(id, { nombre, apellido, fecha_de_nac, fecha_de_ingreso, dni, cuil, email, puesto });
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        const [filas] = await empleadosModel.obtenerPorId(id);
        res.status(200).json({
            mensaje: 'Empleado actualizado con éxito',
            empleado: filas[0]
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
        const [resultado] = await empleadosModel.actualizarParcial(id, campos);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        const [filas] = await empleadosModel.obtenerPorId(id);
        res.status(200).json({
            mensaje: 'Empleado actualizado con éxito',
            empleado: filas[0]
        });
    }
    ;
    async eliminar(req, res) {
        const { id } = req.params;
        const [resultado] = await empleadosModel.eliminar(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.status(200).json({ mensaje: 'Empleado eliminado con éxito' });
    }
}
export default new EmpleadosController();
//# sourceMappingURL=empleadosControllers.js.map