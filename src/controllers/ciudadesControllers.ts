import type { Request, Response } from 'express';
//import ciudadesModel from '../models/ciudadesModels.js';
import {prisma} from "../config/prisma.js";
class CiudadesController {
    constructor () { }
//Creamos los métodos para reemplazar las funciones en Routes
//GET
    async consultar(req:Request, res:Response) {
        try{
            const ciudades = await prisma.ciudades.findMany();
            return res.status(200).json({
                total: ciudades.length,
                ciudades: ciudades
            });
            }catch(err){

               if(err instanceof Error)

                res.status(500).json({error:err.message});
        }
    }

//GET categorías por nombre
    async buscar(req:Request, res:Response) {
        try{
            const { texto }= req.params;
            const result= await prisma.ciudades.findMany({
                where: {
                    nombre: {
                        contains: String(texto),
                        mode: 'insensitive'
                    }
                }
            });
            return res.status(200).json({ 
                total: result.length, 
                categorias: result });
            }catch(err){
              if(err instanceof Error)
                  res.status(500).json({error:err.message});
           }
    }
    //GET estadísticas: unidades vendidas por ciudad
async estadisticas(req: Request, res: Response) {
    try {
        const resultado = await prisma.ciudades.findMany({
            select: {
                id_ciudad: true,
                nombre: true,
                _count: {
                    select: {
                        clientes: true // Cuenta cuántos clientes pertenecen a esta ciudad
                    }
                }
            }
        });

        // para retornar el objeto en el .map()
        const estadisticasFormateadas = resultado.map(ciudad => ({
            id_ciudad: ciudad.id_ciudad,
            nombre: ciudad.nombre,
            total_clientes: ciudad._count.clientes
        }));

        return res.status(200).json({ estadisticas: estadisticasFormateadas });

    } catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({ error: err.message });
        }
    }
}

//POST
    async ingresar(req:Request, res:Response) {
        try{
            const {nombre } = req.body;

            if (!nombre ) {
                return res.status(400).json({error: 'faltan campos obligatorios'});
            }
            
            const nuevaCiudad  = await prisma.ciudades.create({ 
                data:{
                    nombre:nombre
             }
            });

             return res.status (201).json({
                mensaje: 'Ciudad creada con éxito',
                id: nuevaCiudad.id_ciudad
            });
            }catch(err){
               if(err instanceof Error)
                 return  res.status(500).json({error:err.message});
           }
       }

 //GET id
    async consultarDetalle(req:Request, res:Response) {
        try{
            const { id } = req.params;

            const ciudad = await prisma.ciudades.findUnique({
                where: {
                    id_ciudad: Number(id)
                }
            });

            if (!ciudad) {
                return res.status(404).json({ error: 'Ciudad no encontrada' });
            }

            return res.status(200).json(ciudad);
            }catch(err){
            if(err instanceof Error)
                 return res.status(500).json({error:err.message});
           }
        }
//PUT
    async actualizar(req:Request, res:Response) {
        try{
            const  id  =Number(req.params.id);
            const { nombre} = req.body;

            const ciudadExiste = await prisma.ciudades.findUnique({
                where: {
                    id_ciudad: Number(id)
                }
            });

            if (!ciudadExiste) {
                return res.status(404).json({ 
                    error: 'Ciudad no encontrada' 
                });
            }

            const ciudadActualizada = await prisma.ciudades.update({
                where: {
                    id_ciudad: Number(id)
                },
                data: {
                    nombre: nombre
                }
            });

             return res.status(200).json({
                mensaje: 'Ciudad actualizada con éxito',
                ciudad: ciudadActualizada
            });
            }catch(err){
              if(err instanceof Error)
                return  res.status(500).json({error:err.message});
        }
    
    }
//PATCH
    async actualizarParcial(req:Request, res:Response) {
        try{
            const { id } = req.params;
            const campos = req.body;

            if (!campos || Object.keys(campos).length === 0) {
                return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
            }
        
            const ciudadActualizada = await prisma.ciudades.update({
                where: {
                    id_ciudad: Number(id)
                },
                data:campos
            });
            return res.status(200).json({
                 mensaje: 'Ciudad actualizada con éxito',
                ciudad: ciudadActualizada
             });
            }catch(err){
            if(err instanceof Error)
                return res.status(500).json({error:err.message});
        }
    }

    async eliminar(req:Request, res:Response) {
        try{
            const  id  = Number(req.params.id);

            const ciudadExiste = await prisma.ciudades.findUnique({
                where: {id_ciudad:Number(id)

                }
            });

            if (!ciudadExiste) {
              return res.status(404).json({ 
                error: 'Ciudad no encontrada' });
            }
            await prisma.ciudades.delete({
                where: {
                    id_ciudad: Number(id)
                }
            });
            return res.status(200).json({
                 mensaje: 'Ciudad eliminada con éxito' });
            }catch(err){
                if(err instanceof Error)
                   res.status(500).json({error:err.message});
            }
       }

}


export default new CiudadesController()