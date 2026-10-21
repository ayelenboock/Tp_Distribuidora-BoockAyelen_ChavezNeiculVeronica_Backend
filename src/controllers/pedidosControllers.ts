import type { Request, Response, NextFunction } from 'express';
import PedidosModel from '../models/pedidosModels.js';
import type { PedidosEstado } from '../generated/prisma/enums.js';

class PedidosController {
    constructor (){}

//GET
    async consultar(req:Request, res:Response, next: NextFunction) {
        try {
            // El model trae cada pedido con su cliente, empleado y compañía (JOIN)
            const pedidos = await PedidosModel.obtenerTodos();

            return res.status(200).json({
                total: pedidos.length,
                pedidos: pedidos
            });
       } catch (err) {
           next(err); // lo maneja el middleware global de errores
       }
    }
//POST
    async ingresar(req:Request, res:Response, next: NextFunction) {
        try {
            const { id_cliente, id_empleado, id_compania, total, estado } = req.body;

            if (!id_cliente || !id_empleado || !id_compania || total === undefined) {
                return res.status(400).json({ error: 'faltan campos obligatorios' });
            }

            const nuevoPedido = await PedidosModel.crear({
                id_cliente: Number(id_cliente),
                id_empleado: Number(id_empleado),
                id_compania: Number(id_compania),
                total: total,
                ...(estado && { estado: estado as PedidosEstado }) // Estado opcional: si no viene, se usa 'Pendiente'
            });

            return res.status(201).json({
                mensaje: 'Pedido creado con éxito',
                id: nuevoPedido.id_pedido
            });
           }catch(err){
               next(err); // lo maneja el middleware global de errores
           }
    }

// GET estado
        async consultarPorEstado(req:Request, res:Response, next: NextFunction) {
         try {
            const { estado } = req.params;

            const pedidos = await PedidosModel.obtenerPorEstado(estado as PedidosEstado);

            return res.status(200).json({
                total: pedidos.length,
                pedidos: pedidos
            });
            }catch(err){
                next(err); // lo maneja el middleware global de errores
            }
    }

//GET estadisticas
    async estadisticas(req:Request, res:Response, next: NextFunction) {
        try{
            const agrupadoPorEstado = await PedidosModel.obtenerEstadisticas();

            const estadisticasFormateadas = agrupadoPorEstado.map(grupo => ({
                estado: grupo.estado,
                cantidad_pedidos: grupo._count.id_pedido,
                total_facturado: Number(grupo._sum.total || 0)
            }));
             return res.status(200).json({ estadisticas: estadisticasFormateadas });
        } catch (err) {
            next(err); // lo maneja el middleware global de errores
        }
    }
 //GET id
    async consultarDetalle(req:Request, res:Response, next: NextFunction) {
        try{
            const {id}=req.params;
            // El model trae el pedido con sus detalles y la info de cada producto
            const pedido = await PedidosModel.obtenerPorId(Number(id));

            if (!pedido) {
                return res.status(404).json({ error: 'Pedido no encontrado' });
            }

            return res.status(200).json(pedido);
        }catch(err){
            next(err); // lo maneja el middleware global de errores
        }
    }

//PUT
    async actualizar(req:Request, res:Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { id_cliente, id_empleado, id_compania, total, estado } = req.body;

            if (!id_cliente || !id_empleado || !id_compania || total === undefined || !estado) {
                return res.status(400).json({ error: 'faltan campos obligatorios' });
            }

            const pedidoActualizado = await PedidosModel.actualizar(Number(id), {
                id_cliente: Number(id_cliente),
                id_empleado: Number(id_empleado),
                id_compania: Number(id_compania),
                total: total,
                estado: estado as PedidosEstado
            });

            return res.status(200).json({
                mensaje: 'Pedido actualizado con éxito',
                pedido: pedidoActualizado
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
            const permitidos = ['id_cliente', 'id_empleado', 'id_compania', 'total', 'estado'];

            // Nos quedamos solo con los campos permitidos que vinieron en el body
            const campos: Record<string, any> = Object.fromEntries(
                Object.entries(req.body ?? {}).filter(([key]) => permitidos.includes(key))
            );

            if (Object.keys(campos).length === 0) {
                return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar' });
            }

            // Validamos conversiones de campos numéricos si es que vienen en el body
            if (campos.id_cliente !== undefined) campos.id_cliente = Number(campos.id_cliente);
            if (campos.id_empleado !== undefined) campos.id_empleado = Number(campos.id_empleado);
            if (campos.id_compania !== undefined) campos.id_compania = Number(campos.id_compania);

            // Verificamos que el pedido exista
            const pedidoExistente = await PedidosModel.obtenerPorId(id);

            if (!pedidoExistente) {
                return res.status(404).json({ error: 'Pedido no encontrado' });
            }

            const pedidoActualizado = await PedidosModel.actualizarParcial(id, campos);

            return res.status(200).json({
                mensaje: 'Pedido actualizado con éxito',
                pedido: pedidoActualizado
            });
           }catch(err){
               next(err); // lo maneja el middleware global de errores
           }
    }

    async eliminar(req:Request, res:Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            // Verificamos que el pedido exista antes de intentar borrarlo
            const pedidoExistente = await PedidosModel.obtenerPorId(id);

            if (!pedidoExistente) {
                return res.status(404).json({ error: 'Pedido no encontrado' });
            }

            await PedidosModel.eliminar(id);

            return res.status(200).json({ mensaje: 'Pedido eliminado con éxito' });

           }catch(err){
               next(err); // lo maneja el middleware global de errores
           }
    }

}

export default new PedidosController();
