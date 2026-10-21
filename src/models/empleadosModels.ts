import { prisma } from "../config/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";

class EmpleadosModel {
    async obtenerTodos() {
        return await prisma.empleados.findMany();
    }

    // Filtrar: empleados de un puesto
    async obtenerPorPuesto(puesto: string) {
        return await prisma.empleados.findMany({
            where: {
                puesto: {
                    contains: puesto
                }
            }
        });
    }

    //Cantidad de pedidos y total vendido por empleado (JOIN empleados -> pedidos)
    async obtenerEstadisticas() {
        return await prisma.empleados.findMany({
            select: {
                id_empleado: true,
                nombre: true,
                apellido: true,
                puesto: true,
                pedidos: {
                    select: {
                        total: true
                    }
                }
            }
        });
    }

    async crear(datos: Prisma.EmpleadosUncheckedCreateInput) {
        return await prisma.empleados.create({
            data: datos
        });
    }

    async obtenerPorId(id: number) {
        return await prisma.empleados.findUnique({
            where: { id_empleado: id }
        });
    }

    async actualizar(id: number, datos: Prisma.EmpleadosUncheckedUpdateInput) {
        return await prisma.empleados.update({
            where: { id_empleado: id },
            data: datos
        });
    }

    async eliminar(id: number) {
        return await prisma.empleados.delete({
            where: { id_empleado: id }
        });
    }

    // Recibe solo los campos permitidos (el filtrado se hace en el controlador)
    async actualizarParcial(id: number, campos: Prisma.EmpleadosUncheckedUpdateInput) {
        return await prisma.empleados.update({
            where: { id_empleado: id },
            data: campos
        });
    }
}

export default new EmpleadosModel()
