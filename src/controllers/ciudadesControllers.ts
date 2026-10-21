import type { Request, Response, NextFunction } from 'express';
import CiudadesModel from '../models/ciudadesModels.js';
class CiudadesController {
    constructor () { }
//Creamos los métodos para reemplazar las funciones en Routes
//GET
    async consultar(req:Request, res:Response, next: NextFunction) {
        try{
            const ciudades = await CiudadesModel.obtenerTodos();
            return res.status(200).json({
                total: ciudades.length,
                ciudades: ciudades
            });
            }catch(err){
                next(err); // lo maneja el middleware global de errores
            }
    }

//GET categorías por nombre
    async buscar(req:Request, res:Response, next: NextFunction) {
        try{
            const { texto }= req.params;
            const result= await CiudadesModel.buscarPorNombre(String(texto));
            return res.status(200).json({
                total: result.length,
                ciudades: result });
            }catch(err){
                next(err); // lo maneja el middleware global de errores
            }
    }
    //GET estadísticas: unidades vendidas por ciudad
async estadisticas(req: Request, res: Response, next: NextFunction) {
    try {
        const resultado = await CiudadesModel.obtenerEstadisticas();

        // para retornar el objeto en el .map()
        const estadisticasFormateadas = resultado.map(ciudad => ({
            id_ciudad: ciudad.id_ciudad,
            nombre: ciudad.nombre,
            total_clientes: ciudad._count.clientes
        }));

        return res.status(200).json({ estadisticas: estadisticasFormateadas });

    } catch (err) {
        next(err); // lo maneja el middleware global de errores
    }
}

//POST
    async ingresar(req:Request, res:Response, next: NextFunction) {
        try{
            const {nombre } = req.body;

            if (!nombre ) {
                return res.status(400).json({error: 'faltan campos obligatorios'});
            }

            const nuevaCiudad  = await CiudadesModel.crear({
                nombre:nombre
            });

             return res.status (201).json({
                mensaje: 'Ciudad creada con éxito',
                id: nuevaCiudad.id_ciudad
            });
            }catch(err){
                next(err); // lo maneja el middleware global de errores
            }
       }

 //GET id
    async consultarDetalle(req:Request, res:Response, next: NextFunction) {
        try{
            const { id } = req.params;

            const ciudad = await CiudadesModel.obtenerPorId(Number(id));

            if (!ciudad) {
                return res.status(404).json({ error: 'Ciudad no encontrada' });
            }

            return res.status(200).json(ciudad);
            }catch(err){
                next(err); // lo maneja el middleware global de errores
            }
        }
//PUT
    async actualizar(req:Request, res:Response, next: NextFunction) {
        try{
            const  id  =Number(req.params.id);
            const { nombre} = req.body;

            const ciudadExiste = await CiudadesModel.obtenerPorId(id);

            if (!ciudadExiste) {
                return res.status(404).json({
                    error: 'Ciudad no encontrada'
                });
            }

            const ciudadActualizada = await CiudadesModel.actualizar(id, {
                nombre: nombre
            });

             return res.status(200).json({
                mensaje: 'Ciudad actualizada con éxito',
                ciudad: ciudadActualizada
            });
            }catch(err){
                next(err); // lo maneja el middleware global de errores
            }

    }
//PATCH
    async actualizarParcial(req:Request, res:Response, next: NextFunction) {
        try{
            const id = Number(req.params.id);

            // Lista de columnas que se pueden modificar
            const permitidos = ['nombre'];

            // Nos quedamos solo con los campos permitidos que vinieron en el body
            const campos: Record<string, any> = Object.fromEntries(
                Object.entries(req.body ?? {}).filter(([key]) => permitidos.includes(key))
            );

            if (Object.keys(campos).length === 0) {
                return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar' });
            }

            // Verificamos que la ciudad exista
            const ciudadExiste = await CiudadesModel.obtenerPorId(id);

            if (!ciudadExiste) {
                return res.status(404).json({ error: 'Ciudad no encontrada' });
            }

            const ciudadActualizada = await CiudadesModel.actualizarParcial(id, campos);
            return res.status(200).json({
                 mensaje: 'Ciudad actualizada con éxito',
                ciudad: ciudadActualizada
             });
            }catch(err){
                next(err); // lo maneja el middleware global de errores
            }
    }

    async eliminar(req:Request, res:Response, next: NextFunction) {
        try{
            const  id  = Number(req.params.id);

            const ciudadExiste = await CiudadesModel.obtenerPorId(id);

            if (!ciudadExiste) {
              return res.status(404).json({
                error: 'Ciudad no encontrada' });
            }
            await CiudadesModel.eliminar(id);
            return res.status(200).json({
                 mensaje: 'Ciudad eliminada con éxito' });
            }catch(err){
                next(err); // lo maneja el middleware global de errores
            }
       }

}


export default new CiudadesController()
