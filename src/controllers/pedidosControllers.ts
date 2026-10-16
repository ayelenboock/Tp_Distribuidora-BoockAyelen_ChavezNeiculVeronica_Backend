import type { Request, Response } from 'express';
//import PedidosModel from '../models/pedidosModels.js';
import { prisma } from "../config/prisma.js";

class PedidosController {
    constructor (){}
    
//GET
    async consultar(req:Request, res:Response) {
        try {
            const pedidos = await prisma.pedidos.findMany();

            return res.status(200).json({
                total: pedidos.length,
                pedidos: pedidos
            });
       } catch (err) {
            if (err instanceof Error)
                return res.status(500).json({ error: err.message });
        }
    }
//POST
    async ingresar(req:Request, res:Response) {
        try {
            const { id_cliente, id_empleado, id_compania, total, estado } = req.body;

            if (!id_cliente || !id_empleado || !id_compania || total === undefined) {
                return res.status(400).json({ error: 'faltan campos obligatorios' });
            }

            const nuevoPedido = await prisma.pedidos.create({
                data: {
                    id_cliente: Number(id_cliente),
                    id_empleado: Number(id_empleado),
                    id_compania: Number(id_compania),
                    total: total,
                    estado: estado ? (estado as any) : undefined // Casteo opcional del Enum
                }
            });

            return res.status(201).json({
                mensaje: 'Pedido creado con éxito',
                id: nuevoPedido.id_pedido
            });
           }catch(err){
               if(err instanceof Error)
                  return   res.status(500).json({error:err.message});
        }
    }
    
// GET estado
        async consultarPorEstado(req:Request, res:Response) {
         try {
            const { estado } = req.params;

            const pedidos = await prisma.pedidos.findMany({
                where: {
                    estado: estado as any
                }
            });

            return res.status(200).json({ 
                total: pedidos.length, 
                pedidos: pedidos 
            });    
            }catch(err){
               if(err instanceof Error)
                  res.status(500).json({error:err.message});
        }
    }

//GET estadisticas
    async estadisticas(req:Request, res:Response) {
        try{
            const agrupadoPorEstado = await prisma.pedidos.groupBy({
                by: ['estado'],
                _count: {
                    id_pedido: true
                },
                _sum: {
                    total: true
                }
            });

            const estadisticasFormateadas = agrupadoPorEstado.map(grupo => ({
                estado: grupo.estado,
                cantidad_pedidos: grupo._count.id_pedido,
                total_facturado: Number(grupo._sum.total || 0)
            }));
             return res.status(200).json({ estadisticas: estadisticasFormateadas });
        } catch (err) {
            if (err instanceof Error)
                return res.status(500).json({ error: err.message });
        }
    }
 //GET id
    async consultarDetalle(req:Request, res:Response) {
        try{
            const {id}=req.params;
            const pedido = await prisma.pedidos.findUnique({
                where: {
                    id_pedido: Number(id)
                },
                include: {
                    detalles: {
                        include: {
                            producto: true // Opcional: Esto además te trae la info del Producto (nombre, etc.)
                        }
                    }
                }
            });

            if (!pedido) {
                return res.status(404).json({ error: 'Pedido no encontrado' });
            }

            return res.status(200).json(pedido);
        }catch(err){
            if(err instanceof Error)
                res.status(500).json({error:err.message});
        }
    }

//PUT
    async actualizar(req:Request, res:Response) {
        try {
            const { id } = req.params;
            const { id_cliente, id_empleado, id_compania, total, estado } = req.body;

            if (!id_cliente || !id_empleado || !id_compania || total === undefined || !estado) {
                return res.status(400).json({ error: 'faltan campos obligatorios' });
            }

            const pedidoActualizado = await prisma.pedidos.update({
                where: {
                    id_pedido: Number(id)
                },
                data: {
                    id_cliente: Number(id_cliente),
                    id_empleado: Number(id_empleado),
                    id_compania: Number(id_compania),
                    total: total,
                    estado: estado as any
                }
            });

            return res.status(200).json({
                mensaje: 'Pedido actualizado con éxito',
                pedido: pedidoActualizado
            });

        }catch(err){
            if(err instanceof Error)
                res.status(500).json({error:err.message});
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

            // Validamos conversiones de campos numéricos si es que vienen en el body
            if (campos.id_cliente !== undefined) campos.id_cliente = Number(campos.id_cliente);
            if (campos.id_empleado !== undefined) campos.id_empleado = Number(campos.id_empleado);
            if (campos.id_compania !== undefined) campos.id_compania = Number(campos.id_compania);

            const pedidoActualizado = await prisma.pedidos.update({
                where: {
                    id_pedido: Number(id)
                },
                data: campos
            });
           
            return res.status(200).json({
                mensaje: 'Pedido actualizado con éxito',
                pedido: pedidoActualizado
            });
           }catch(err){
                if(err instanceof Error)
                     return res.status(500).json({error:err.message});
        }
    }

    async eliminar(req:Request, res:Response) {
        try {
            const { id } = req.params;

            await prisma.pedidos.delete({
                where: {
                    id_pedido: Number(id)
                }
            });

            return res.status(200).json({ mensaje: 'Pedido eliminado con éxito' });
        
           }catch(err){
               if(err instanceof Error)
                   return   res.status(500).json({error:err.message});
        }
    }

}

export default new PedidosController();