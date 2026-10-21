import type { Request, Response, NextFunction } from 'express';
import EmpleadosModel from '../models/empleadosModels.js';
class EmpleadosController {
    constructor (){}

    //GET
    async consultar(req:Request, res:Response, next: NextFunction) {
        try{
            const empleados = await EmpleadosModel.obtenerTodos();

            return res.status(200).json({
                total: empleados.length,
                empleados: empleados
            });
            }catch(err){
                next(err); // lo maneja el middleware global de errores
            }
       }

    //GET empleados filtrados por puesto
    async consultarPorPuesto(req:Request, res:Response, next: NextFunction) {
        try{
            const {puesto}= req.params;
            const empleados = await EmpleadosModel.obtenerPorPuesto(String(puesto));
            return res.status(200).json({
                total: empleados.length,
                 empleados: empleados
                 });
            }catch(err){
                next(err); // lo maneja el middleware global de errores
            }
      }

    //GET estadísticas: pedidos y total vendido por empleado
    async estadisticas(req:Request, res:Response, next: NextFunction) {
       try {
            // Traemos los empleados junto a sus pedidos asociados
            const resultado = await EmpleadosModel.obtenerEstadisticas();

            // Formateamos las estadísticas sumando las ventas
            const estadisticasFormateadas = resultado.map(empleado => {
                const totalVendido = empleado.pedidos.reduce((acumulado, pedido) => {
                    return acumulado + Number(pedido.total);
                }, 0);

                return {
                    id_empleado: empleado.id_empleado,
                    nombre: empleado.nombre,
                    apellido: empleado.apellido,
                    puesto: empleado.puesto,
                    cantidad_pedidos: empleado.pedidos.length,
                    total_vendido: totalVendido
                };
            });

             res.status(200).json({ estadisticasFormateadas });
        }catch(err){
            next(err); // lo maneja el middleware global de errores
        }
    }

//POST
    async ingresar(req:Request,res:Response, next: NextFunction){
         try {
            const { nombre, apellido, fecha_de_nac, fecha_de_ingreso, dni, cuil, email, puesto } = req.body;

            if (!nombre || !apellido || !fecha_de_nac || !fecha_de_ingreso || !dni || !cuil || !email || !puesto) {
                return res.status(400).json({ error: 'Faltan Campos Obligatorios' });
            }

            const nuevoEmpleado = await EmpleadosModel.crear({
                nombre,
                apellido,
                fecha_de_nac: new Date(fecha_de_nac), // Conversión obligatoria a Date
                fecha_de_ingreso: new Date(fecha_de_ingreso), // Conversión obligatoria a Date
                dni,
                cuil,
                email,
                puesto
            });

            return res.status(201).json({
                mensaje: 'Empleado creado con éxito',
                id: nuevoEmpleado.id_empleado
            });
        }catch(err){
            next(err); // lo maneja el middleware global de errores
        }
    }

    //GET id
    async consultarDetalle(req:Request, res:Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const empleado = await EmpleadosModel.obtenerPorId(Number(id));

            if (!empleado) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }

            return res.status(200).json(empleado);
          }catch(err){
              next(err); // lo maneja el middleware global de errores
          }
     }
//PUT
    async actualizar(req:Request, res:Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { nombre, apellido, fecha_de_nac, fecha_de_ingreso, dni, cuil, email, puesto } = req.body;

            if (!nombre || !apellido || !fecha_de_nac || !fecha_de_ingreso || !dni || !cuil || !email || !puesto) {
                return res.status(400).json({ error: 'faltan campos obligatorios' });
            }

            const empleadoActualizado = await EmpleadosModel.actualizar(Number(id), {
                nombre,
                apellido,
                fecha_de_nac: new Date(fecha_de_nac),
                fecha_de_ingreso: new Date(fecha_de_ingreso),
                dni,
                cuil,
                email,
                puesto
            });

            return res.status(200).json({
                mensaje: 'Empleado actualizado con éxito',
                empleado: empleadoActualizado
            });
            }catch(err){
                next(err); // lo maneja el middleware global de errores
            }
        }
//PATCH
    async actualizarParcial(req:Request, res:Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            // Lista de columnas que se pueden modificar
            const permitidos = ['nombre', 'apellido', 'fecha_de_nac', 'fecha_de_ingreso', 'dni', 'cuil', 'email', 'puesto'];

            // Nos quedamos solo con los campos permitidos que vinieron en el body
            const campos: Record<string, any> = Object.fromEntries(
                Object.entries(req.body ?? {}).filter(([key]) => permitidos.includes(key))
            );

            if (Object.keys(campos).length === 0) {
                return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar' });
            }


            // Si vienen las fechas en la actualización parcial, las parseamos
            if (campos.fecha_de_nac) campos.fecha_de_nac = new Date(campos.fecha_de_nac);
            if (campos.fecha_de_ingreso) campos.fecha_de_ingreso = new Date(campos.fecha_de_ingreso);

            // Verificamos que el empleado exista
            const empleadoExistente = await EmpleadosModel.obtenerPorId(id);

            if (!empleadoExistente) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }

            const empleadoActualizado = await EmpleadosModel.actualizarParcial(id, campos);

            return res.status(200).json({
                mensaje: 'Empleado actualizado con éxito',
                empleado: empleadoActualizado
            });
           }catch(err){
               next(err); // lo maneja el middleware global de errores
           }
        }

    async eliminar(req:Request, res:Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            // Verificamos que el empleado exista antes de intentar borrarlo
            const empleadoExistente = await EmpleadosModel.obtenerPorId(id);

            if (!empleadoExistente) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }

            await EmpleadosModel.eliminar(id);

            return res.status(200).json({ mensaje: 'Empleado eliminado con éxito' });

           }catch(err){
               next(err); // lo maneja el middleware global de errores
           }
    }

}

export default new EmpleadosController();
