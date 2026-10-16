import type { Request, Response } from 'express';
//import CategoriasModel from '../models/categoriasModels.js';
import {prisma} from "../config/prisma.js";

class CategoriasController {
    constructor () { }
//Creamos los métodos para reemplazar las funciones en Routes
//GET
    async consultar(req: Request, res: Response) {
        try{
            const categorias = await prisma.categorias.findMany();

            return res.status(200).json({
                total: categorias.length,
                categorias: categorias
            });
        }catch(err){
            if(err instanceof Error)
                res.status(500).json({error:err.message});
        }
    }

//GET categorías por nombre
    async buscar(req:Request, res:Response) {
        try{
            const { texto }=req.params;
        const result = await prisma.categorias.findMany({
            where:{
                nombre:{
                    
                    contains: String(texto),
                    mode: 'insensitive' //para que no importe si es MAYUSC o min
                }
            }
        });
        return res.status(200).json({ 
            total: result.length, 
            categorias: result 
        });
    }catch(err){
            if(err instanceof Error)
                res.status(500).json({error:err.message});
        }
    }

    //GET estadísticas: unidades vendidas por categoría
    async estadisticas(req:Request, res:Response) {
        try{
            const resultado = await prisma.categorias.findMany({
                select: {
                    id_categoria: true,
                    nombre: true,
                    productos: {
                        select: {
                            detalles:{
                                select: {
                                    cantidad: true
                                }
                            }
                        }
                    }
                }
            });
            //formatear los datos para que devuelva la categoria junto al total de unidades sumadas
            const estadisticasFormateadas = resultado.map(cat => {
                 // Sumamos todas las cantidades de todos los productos de esta categoría
            const unidadesVendidas = cat.productos.reduce((totalProd, prod) => {
                const totalDetalles = prod.detalles.reduce((totalDet, det) => totalDet + det.cantidad, 0);
                return totalProd + totalDetalles;
            }, 0);

            return {
                id_categoria: cat.id_categoria,
                nombre: cat.nombre,
                unidades_vendidas: unidadesVendidas
            };
        });
        return res.status(200).json({ estadisticas: estadisticasFormateadas });
        }catch(err){
            if(err instanceof Error)
                 return res.status(500).json({error:err.message});
            }
        }

//POST
    async ingresar(req:Request, res:Response) {
        try{
            const {nombre, descripcion } = req.body;

            if (!nombre || !descripcion) {
                return res.status(400).json({error: 'faltan campos obligatorios'});
            }
            
            const nuevaCategoria = await prisma.categorias.create({
                data:{
                    nombre: nombre,
                    descripcion: descripcion
                } 
            });
            return res.status (201).json({
                mensaje: 'Categoría creada con éxito',
                id: nuevaCategoria.id_categoria
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

        const categoria = await prisma.categorias.findUnique({
            where: {
                id_categoria: Number(id)
            }
        });
        //si prisma no encuentra el registro, devuelve un null
        if (!categoria) {
                return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        //devolver el objeto directamente
        return res.status(200).json(categoria);
        }catch(err){
            if(err instanceof Error)
                return res.status(500).json({error:err.message});
        }
    }
//PUT
    async actualizar(req:Request, res:Response) {
        try{
            const id  = Number( req.params.id);
            const { nombre, descripcion } = req.body;
            if (!nombre ||!descripcion) {
                return res.status(400).json({error: 'faltan campos obligatorios'});
            }
            const categoriaExistente = await prisma.categorias.findUnique({
                where: {
                    id_categoria: Number(id)
                }
            });

            if (!categoriaExistente) {
                return res.status(404).json({ 
                    error: 'Categoría no encontrada'
                 });
            }

            const categoriaActualizado= await prisma.categorias.update({
                where: { 
                    id_categoria: Number(id)
                 },
                data: {
                    nombre: nombre,
                    descripcion: descripcion

                }
            });
            //prisma devuelve el registro recien modificado de forma directa
            return res.status(200).json({
                mensaje: 'Categoría actualizada con éxito',
                categoria: categoriaActualizado
            });
           
            }catch(err){
               if(err instanceof Error){
                    return res.status(500).json({error:err.message});
             }
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
        
            const categoriaActualizada = await prisma.categorias.update({
                where: {
                    id_categoria: Number(id)
                },
                data: campos
            });
            return res.status(200).json({
                mensaje: 'Categoria actualizada con éxito',
                categoria: categoriaActualizada
            });
            
        }catch(err){
            if(err instanceof Error)
                return res.status(500).json({error:err.message});
        }
    }

    async eliminar(req:Request, res:Response) {
        try{
            const  id  = Number(req.params.id);
            //verificamos si la categoria existe antes de intentar borrarlo
            const categoriaExistente = await prisma.categorias.findUnique({
                where: {id_categoria: Number(id)

                }
            }) ;

            if (!categoriaExistente) {
              return res.status(404).json({
                 error: 'Categoría no encontrada' });
            }
            //si existe, lo eliminamos de la base de datos
            await prisma.categorias.delete({
                where: {
                    id_categoria: Number(id)
                }
            });
            //devolvemos un mensaje de exito

            return res.status(200).json({
                 mensaje: 'Categoría eliminada con éxito' });
            }catch(err){
            if(err instanceof Error)
                res.status(500).json({
            error:err.message
        });
        }
    }

}
export default new CategoriasController()