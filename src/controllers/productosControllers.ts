import type { Request,  Response } from 'express';
//import productosModel from '../models/productosModels.js';
import { prisma } from "../config/prisma.js";
class ProductosController {
    constructor () { }

//GET
    async consultar(req:Request, res:Response) {
         try {
            const productos = await prisma.productos.findMany();

            return res.status(200).json({
                total: productos.length,
                productos: productos
            });
        } catch (err) {
            if (err instanceof Error)
                return res.status(500).json({ error: err.message });
        }
    }

//GET productos filtrados por categoría
    async consultarPorCategoria(req:Request, res:Response) {
        try {
            const id_cat = Number(req.params.id);

            const productos = await prisma.productos.findMany({
                where: {
                    id_categoria: id_cat
                }
            });

            return res.status(200).json({ 
                total: productos.length, 
                productos: productos 
            });
           }catch(err){
               if(err instanceof Error)
                   return  res.status(500).json({error:err.message});
        }
    }

//GET estadísticas por categoría
    async estadisticas(req:Request, res:Response) {
    try {
            // Agrupamos los productos por categoría calculando stock total y precio promedio
            const agrupado = await prisma.productos.groupBy({
                by: ['id_categoria'],
                _sum: {
                    stock: true
                },
                _avg: {
                    precio: true
                },
                _count: {
                    id_producto: true
                }
            });

            const estadisticasFormateadas = agrupado.map(grupo => ({
                id_categoria: grupo.id_categoria,
                total_productos: grupo._count.id_producto,
                stock_total: grupo._sum.stock || 0,
                precio_promedio: Number(grupo._avg.precio || 0)
            }));

            return res.status(200).json({ estadisticas: estadisticasFormateadas });
            
            }catch(err){
                 if(err instanceof Error)
                        return res.status(500).json({error:err.message});
        }
    }

//POST
    async ingresar(req:Request, res:Response) {
        
         try {
            const { id_categoria, id_proveedor, nombre_producto, descripcion, precio, stock } = req.body;

            if (!id_categoria || !id_proveedor || !nombre_producto || !descripcion || precio === undefined) {
                return res.status(400).json({ error: 'faltan campos obligatorios' });
            }
            
            const nuevoProducto = await prisma.productos.create({
                data: {
                    id_categoria: Number(id_categoria),
                    id_proveedor: Number(id_proveedor),
                    nombre_producto: nombre_producto,
                    descripcion: descripcion,
                    precio: precio,
                    stock: stock !== undefined ? Number(stock) : 0
                }
            });

            return res.status(201).json({
                mensaje: 'Producto creado con éxito',
                id: nuevoProducto.id_producto
            });
           }catch(err){
                 if(err instanceof Error)
                     return res.status(500).json({error:err.message});
        }
    }
    

 //GET id
    async consultarDetalle(req:Request, res:Response) {
        try {
            const { id } = req.params;

            const producto = await prisma.productos.findUnique({
                where: {
                    id_producto: Number(id)
                },
                include: {
                    categoria: true, // Te incluye la info de la categoría vinculada
                    proveedor: true  // Te incluye la info del proveedor vinculado
                }
            });

            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            return res.status(200).json(producto);
            }catch(err){
                if(err instanceof Error)
                     return res.status(500).json({error:err.message});
        }
    }
//PUT
    async actualizar(req:Request, res:Response) {
        try {
            const { id } = req.params;
            const { id_categoria, id_proveedor, nombre_producto, descripcion, precio, stock } = req.body;

            if (!id_categoria || !id_proveedor || !nombre_producto || !descripcion || precio === undefined || stock === undefined) {
                return res.status(400).json({ error: 'faltan campos obligatorios' });
            }

            const productoActualizado = await prisma.productos.update({
                where: {
                    id_producto: Number(id)
                },
                data: {
                    id_categoria: Number(id_categoria),
                    id_proveedor: Number(id_proveedor),
                    nombre_producto: nombre_producto,
                    descripcion: descripcion,
                    precio: precio,
                    stock: Number(stock)
                }
            });

            return res.status(200).json({
                mensaje: 'Producto actualizado con éxito',
                producto: productoActualizado
            });
            }catch(err){
               if(err instanceof Error)
                    return res.status(500).json({error:err.message});
        }
    }
//PATCH
    async actualizarParcial(req:Request, res:Response) {
        try {
            const { id } = req.params;
            const campos = req.body;
        
            if (!campos || Object.keys(campos).length === 0) {
                return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
            }

            // Normalizamos tipos numéricos si vienen en los campos dinámicos
            if (campos.id_categoria !== undefined) campos.id_categoria = Number(campos.id_categoria);
            if (campos.id_proveedor !== undefined) campos.id_proveedor = Number(campos.id_proveedor);
            if (campos.stock !== undefined) campos.stock = Number(campos.stock);

            const productoActualizado = await prisma.productos.update({
                where: {
                    id_producto: Number(id)
                },
                data: campos
            });

            return res.status(200).json({
                mensaje: 'Producto actualizado con éxito',
                producto: productoActualizado
            });
             }catch(err){
                  if(err instanceof Error)
                          return res.status(500).json({error:err.message});
        }
    }

    async eliminar(req:Request, res:Response) {
         try{
            const  id  = Number(req.params.id);
            
                        const productoExistente = await prisma.productos.findUnique({
                            where: {
                                id_producto: Number(id)
            
                            }
                        });
            
                        if (!productoExistente) {
                          return res.status(404).json({ 
                            error: 'Producto no encontrada' });
                        }
                        await prisma.productos.delete({
                            where: {
                                id_producto: Number(id)
                            }
                        });
                        return res.status(200).json({
                             mensaje: 'Productos eliminada con éxito' });
        
               }catch(err){
                     if(err instanceof Error)
                             return res.status(500).json({error:err.message});
               }
        }

}

export default new ProductosController();