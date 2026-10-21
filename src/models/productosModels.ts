import { prisma } from "../config/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";

class ProductosModel {
    // Trae los productos con su categoría y proveedor (JOIN)
    async obtenerTodos() {
        return await prisma.productos.findMany({
            include: {
                categoria: true,
                proveedor: true
            }
        });
    }

    async crear(datos: Prisma.ProductosUncheckedCreateInput) {
        return await prisma.productos.create({
            data: datos
        });
    }

    // Filtrar productos por categoría
    async obtenerPorCategoria(idCategoria: number) {
        return await prisma.productos.findMany({
            where: {
                id_categoria: idCategoria
            }
        });
    }

    // Estadísticas de productos por categoría: cantidad, stock total y precio promedio
    async obtenerEstadisticas() {
        return await prisma.productos.groupBy({
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
    }

    // Trae el producto con su categoría y proveedor (JOIN)
    async obtenerPorId(id: number) {
        return await prisma.productos.findUnique({
            where: { id_producto: id },
            include: {
                categoria: true,
                proveedor: true
            }
        });
    }

    async actualizar(id: number, datos: Prisma.ProductosUncheckedUpdateInput) {
        return await prisma.productos.update({
            where: { id_producto: id },
            data: datos
        });
    }

    async eliminar(id: number) {
        return await prisma.productos.delete({
            where: { id_producto: id }
        });
    }

    // Recibe solo los campos permitidos (el filtrado se hace en el controlador)
    async actualizarParcial(id: number, campos: Prisma.ProductosUncheckedUpdateInput) {
        return await prisma.productos.update({
            where: { id_producto: id },
            data: campos
        });
    }
}

export default new ProductosModel()
