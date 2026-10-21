import { prisma } from "../config/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";

class CategoriasModel {
    async obtenerTodos() {
        return await prisma.categorias.findMany();
    }

    // Filtrar categorías por nombre
    async buscarPorNombre(texto: string) {
        return await prisma.categorias.findMany({
            where: {
                nombre: {
                    contains: texto
                }
            }
        });
    }

    //Unidades vendidas por categoría (JOIN categorias -> productos -> detalles_pedidos)
    async obtenerEstadisticas() {
        return await prisma.categorias.findMany({
            select: {
                id_categoria: true,
                nombre: true,
                productos: {
                    select: {
                        detalles: {
                            select: {
                                cantidad: true
                            }
                        }
                    }
                }
            }
        });
    }

    async crear(datos: Prisma.CategoriasUncheckedCreateInput) {
        return await prisma.categorias.create({
            data: datos
        });
    }

    async obtenerPorId(id: number) {
        return await prisma.categorias.findUnique({
            where: { id_categoria: id }
        });
    }

    async actualizar(id: number, datos: Prisma.CategoriasUncheckedUpdateInput) {
        return await prisma.categorias.update({
            where: { id_categoria: id },
            data: datos
        });
    }

    async eliminar(id: number) {
        return await prisma.categorias.delete({
            where: { id_categoria: id }
        });
    }

    // Recibe solo los campos permitidos (el filtrado se hace en el controlador)
    async actualizarParcial(id: number, campos: Prisma.CategoriasUncheckedUpdateInput) {
        return await prisma.categorias.update({
            where: { id_categoria: id },
            data: campos
        });
    }
}

export default new CategoriasModel()
