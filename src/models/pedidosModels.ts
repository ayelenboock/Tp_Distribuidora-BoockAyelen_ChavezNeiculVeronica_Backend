import { prisma } from "../config/prisma.js";
import type { Prisma, PedidosEstado } from "../generated/prisma/client.js";

class PedidosModel {
    // Trae los pedidos con los datos del cliente, empleado y compañía (JOIN)
    async obtenerTodos() {
        return await prisma.pedidos.findMany({
            include: {
                cliente: true,
                empleado: true,
                compania_envio: true
            }
        });
    }

    async crear(datos: Prisma.PedidosUncheckedCreateInput) {
        return await prisma.pedidos.create({
            data: datos
        });
    }

    // Filtro para obtener pedidos por estado
    async obtenerPorEstado(estado: PedidosEstado) {
        return await prisma.pedidos.findMany({
            where: {
                estado: estado
            }
        });
    }

    // Agregación: cantidad de pedidos y total facturado por estado
    async obtenerEstadisticas() {
        return await prisma.pedidos.groupBy({
            by: ['estado'],
            _count: {
                id_pedido: true
            },
            _sum: {
                total: true
            }
        });
    }

    // Trae el pedido con sus detalles y los productos de cada detalle (JOIN)
    async obtenerPorId(id: number) {
        return await prisma.pedidos.findUnique({
            where: { id_pedido: id },
            include: {
                detalles: {
                    include: {
                        producto: true
                    }
                }
            }
        });
    }

    async actualizar(id: number, datos: Prisma.PedidosUncheckedUpdateInput) {
        return await prisma.pedidos.update({
            where: { id_pedido: id },
            data: datos
        });
    }

    async eliminar(id: number) {
        return await prisma.pedidos.delete({
            where: { id_pedido: id }
        });
    }

    // Recibe solo los campos permitidos (el filtrado se hace en el controlador)
    async actualizarParcial(id: number, campos: Prisma.PedidosUncheckedUpdateInput) {
        return await prisma.pedidos.update({
            where: { id_pedido: id },
            data: campos
        });
    }
}

export default new PedidosModel()
