import { prisma } from "../config/prisma.js";
import type { Prisma, ProveedoresCondicionIva } from "../generated/prisma/client.js";

class ProveedoresModel {
    async obtenerTodos() {
        return await prisma.proveedores.findMany();
    }

    // Filtrar proveedores según su condición de IVA
    async obtenerPorCondicion(condicion: ProveedoresCondicionIva) {
        return await prisma.proveedores.findMany({
            where: {
                condicion_iva: condicion
            }
        });
    }

    //Cantidad de productos y stock por proveedor (JOIN proveedores -> productos)
    async obtenerEstadisticas() {
        return await prisma.proveedores.findMany({
            select: {
                id_proveedor: true,
                razon_social: true,
                productos: {
                    select: {
                        stock: true
                    }
                }
            }
        });
    }

    async crear(datos: Prisma.ProveedoresUncheckedCreateInput) {
        return await prisma.proveedores.create({
            data: datos
        });
    }

    async obtenerPorId(id: number) {
        return await prisma.proveedores.findUnique({
            where: { id_proveedor: id }
        });
    }

    async actualizar(id: number, datos: Prisma.ProveedoresUncheckedUpdateInput) {
        return await prisma.proveedores.update({
            where: { id_proveedor: id },
            data: datos
        });
    }

    async eliminar(id: number) {
        return await prisma.proveedores.delete({
            where: { id_proveedor: id }
        });
    }

    // Recibe solo los campos permitidos (el filtrado se hace en el controlador)
    async actualizarParcial(id: number, campos: Prisma.ProveedoresUncheckedUpdateInput) {
        return await prisma.proveedores.update({
            where: { id_proveedor: id },
            data: campos
        });
    }
}

export default new ProveedoresModel()
