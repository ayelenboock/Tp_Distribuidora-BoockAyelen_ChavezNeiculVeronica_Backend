import { prisma } from "../config/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";

class CiudadesModel {
    async obtenerTodos() {
        return await prisma.ciudades.findMany();
    }

    // Filtrar ciudad por nombre
    async buscarPorNombre(texto: string) {
        return await prisma.ciudades.findMany({
            where: {
                nombre: {
                    contains: texto
                }
            }
        });
    }

    //Cantidad de clientes por ciudad
    async obtenerEstadisticas() {
        return await prisma.ciudades.findMany({
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
    }

    async crear(datos: Prisma.CiudadesUncheckedCreateInput) {
        return await prisma.ciudades.create({
            data: datos
        });
    }

    async obtenerPorId(id: number) {
        return await prisma.ciudades.findUnique({
            where: { id_ciudad: id }
        });
    }

    async actualizar(id: number, datos: Prisma.CiudadesUncheckedUpdateInput) {
        return await prisma.ciudades.update({
            where: { id_ciudad: id },
            data: datos
        });
    }

    async eliminar(id: number) {
        return await prisma.ciudades.delete({
            where: { id_ciudad: id }
        });
    }

    // Recibe solo los campos permitidos (el filtrado se hace en el controlador)
    async actualizarParcial(id: number, campos: Prisma.CiudadesUncheckedUpdateInput) {
        return await prisma.ciudades.update({
            where: { id_ciudad: id },
            data: campos
        });
    }
}

export default new CiudadesModel()
