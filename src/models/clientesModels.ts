import { prisma } from "../config/prisma.js";
import type { Prisma, ClientesCondicionIva } from "../generated/prisma/client.js";

class ClientesModel {
    async obtenerTodos() {
        return await prisma.clientes.findMany();
    }

    async crear(datos: Prisma.ClientesUncheckedCreateInput) {
        return await prisma.clientes.create({
            data: datos
        });
    }

    //Filtrar clientes según su condición de IVA (JOIN con ciudades)
    async obtenerPorCondicion(condicion: ClientesCondicionIva) {
        return await prisma.clientes.findMany({
            where: {
                condicion_iva: condicion
            },
            include: {
                ciudad: true
            }
        });
    }

    //Cantidad de pedidos y total comprado por cliente (JOIN clientes -> pedidos)
    async obtenerEstadisticas() {
        return await prisma.clientes.findMany({
            select: {
                id_cliente: true,
                nombre: true,
                apellido: true,
                cuit: true,
                pedidos: {
                    select: {
                        total: true
                    }
                }
            }
        });
    }

    async obtenerPorId(id: number) {
        return await prisma.clientes.findUnique({
            where: { id_cliente: id }
        });
    }

    async actualizar(id: number, datos: Prisma.ClientesUncheckedUpdateInput) {
        return await prisma.clientes.update({
            where: { id_cliente: id },
            data: datos
        });
    }

    async eliminar(id: number) {
        return await prisma.clientes.delete({
            where: { id_cliente: id }
        });
    }

    // Recibe solo los campos permitidos (el filtrado se hace en el controlador)
    async actualizarParcial(id: number, campos: Prisma.ClientesUncheckedUpdateInput) {
        return await prisma.clientes.update({
            where: { id_cliente: id },
            data: campos
        });
    }
}

export default new ClientesModel()
