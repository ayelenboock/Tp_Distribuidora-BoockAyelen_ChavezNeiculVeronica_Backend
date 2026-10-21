import type { Request, Response, NextFunction } from 'express';
import CompaniasEnvioModel from '../models/companiasEnvioModels.js';

class CompaniasEnvioController {
  constructor() {}

 //GET
    async consultar(req:Request, res:Response, next: NextFunction) {
       try{
        const companias = await CompaniasEnvioModel.obtenerTodos();

        return res.status(200).json({
            total: companias.length,
            companias: companias
        });

        }catch(err){
            next(err); // lo maneja el middleware global de errores
        }
   }

    //GET compañías por nombre
    async buscar(req:Request, res:Response, next: NextFunction) {
        try {
        const { texto } = req.params;

        // Consultamos en la tabla companiaEnvio buscando coincidencias en la columna nombre
        const result = await CompaniasEnvioModel.buscarPorNombre(String(texto));

        return res.status(200).json({
            total: result.length,
            companias: result
        });
        }catch(err){
            next(err); // lo maneja el middleware global de errores
        }
   }

    //GET envíos por compañía
    async estadisticas(req:Request, res:Response, next: NextFunction) {
        try {
        // Consultamos las compañías de envío junto con la cantidad de pedidos de cada una
        const resultado = await CompaniasEnvioModel.obtenerEstadisticas();

        // Formateamos la respuesta para que devuelva un formato limpio y descriptivo
        const estadisticasFormateadas = resultado.map(compania => ({
            id_compania: compania.id_compania,
            nombre: compania.nombre,
            total_envios: compania._count.pedidos
        }));

        return res.status(200).json({ estadisticas: estadisticasFormateadas });

        }catch(err){
            next(err); // lo maneja el middleware global de errores
        }
       }

    //POST
    async ingresar(req:Request,res:Response, next: NextFunction){
        try{
            const {nombre, telefono, direccion,id_ciudad} = req.body;
             if ( !nombre|| !telefono || !direccion||!id_ciudad){
             return res.status(400).json({error: 'Faltan Campos Obligatorios'});
            }
            const nuevaCompania = await CompaniasEnvioModel.crear({
                nombre: nombre,
                telefono: telefono,
                direccion: direccion,
                id_ciudad: Number(id_ciudad)
            });

            return res.status(201).json({
                mensaje: 'Compañía de envio creada con éxito',
                id: nuevaCompania.id_compania
            });

           }catch(err){
               next(err); // lo maneja el middleware global de errores
           }
         }

    //GET id
    async consultarDetalle(req:Request, res:Response, next: NextFunction) {
        try {
            const { id } = req.params;

            // El model trae la compañía junto con los datos de su ciudad (JOIN)
            const compania = await CompaniasEnvioModel.obtenerPorId(Number(id));

            // si prisma no encuentra el registro, devuelve null
            if (!compania) {
                return res.status(404).json({ error: 'Compañía de envío no encontrada' });
            }

            return res.status(200).json(compania);

        }catch(err){
            next(err); // lo maneja el middleware global de errores
        }
    }

//PUT
    async actualizar(req:Request, res:Response, next: NextFunction) {
        try {
        const { id } = req.params;
        const { nombre, telefono, direccion, id_ciudad } = req.body;

        // Validación de campos obligatorios
        if (!nombre || !telefono || !direccion || !id_ciudad) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        // Actualizamos en la base de datos a través del model
        const companiaActualizada = await CompaniasEnvioModel.actualizar(Number(id), {
            nombre: nombre,
            telefono: telefono,
            direccion: direccion,
            id_ciudad: Number(id_ciudad) // Conversión a número obligatoria
        });

        // Prisma nos devuelve el registro recién modificado de forma directa
        return res.status(200).json({
            mensaje: 'Compañía de envio actualizada con éxito',
            compania: companiaActualizada
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
        const permitidos = ['nombre', 'telefono', 'direccion', 'id_ciudad'];

        // Nos quedamos solo con los campos permitidos que vinieron en el body
        const campos: Record<string, any> = Object.fromEntries(
            Object.entries(req.body ?? {}).filter(([key]) => permitidos.includes(key))
        );

        // Validación de que el cuerpo no venga vacío
        if (Object.keys(campos).length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar' });
        }

        // Si se envió id_ciudad para actualizar, garantizamos que sea un número
        if (campos.id_ciudad !== undefined) {
            campos.id_ciudad = Number(campos.id_ciudad);
        }

        // Verificamos que la compañía exista
        const companiaExistente = await CompaniasEnvioModel.obtenerPorId(id);

        if (!companiaExistente) {
            return res.status(404).json({ error: 'Compañía de envío no encontrada' });
        }

        // Prisma actualiza dinámicamente solo las propiedades que vengan en req.body
        const companiaActualizada = await CompaniasEnvioModel.actualizarParcial(id, campos);

        // Retornamos directamente el objeto modificado que nos devuelve Prisma
        return res.status(200).json({
            mensaje: 'Compañía de envio actualizada con éxito',
            compania: companiaActualizada
        });

        }catch(err){
            next(err); // lo maneja el middleware global de errores
        }
    }

    async eliminar(req:Request, res:Response, next: NextFunction) {
        try{
            const id  = Number(req.params.id);
            const companiaExistente = await CompaniasEnvioModel.obtenerPorId(id);

        if (!companiaExistente) {
            return res.status(404).json({ error: 'Compañía de envio no encontrada' });
        }

        // Si existe, procedemos a eliminarla de la base de datos
        await CompaniasEnvioModel.eliminar(id);
          res.status(200).json({ mensaje: 'Compañía de envio eliminada con éxito' });
        }catch(err){
            next(err); // lo maneja el middleware global de errores
        }
    }
}
export default new CompaniasEnvioController();
