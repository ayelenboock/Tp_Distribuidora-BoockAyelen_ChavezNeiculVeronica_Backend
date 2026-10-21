import type { Request,  Response, NextFunction } from 'express';
import ProductosModel from '../models/productosModels.js';
class ProductosController {
    constructor () { }

//GET
    async consultar(req:Request, res:Response, next: NextFunction) {
         try {
            // El model trae cada producto con su categoría y proveedor (JOIN)
            const productos = await ProductosModel.obtenerTodos();

            return res.status(200).json({
                total: productos.length,
                productos: productos
            });
        } catch (err) {
            next(err); // lo maneja el middleware global de errores
        }
    }

//GET productos filtrados por categoría
    async consultarPorCategoria(req:Request, res:Response, next: NextFunction) {
        try {
            const id_cat = Number(req.params.id);

            const productos = await ProductosModel.obtenerPorCategoria(id_cat);

            return res.status(200).json({
                total: productos.length,
                productos: productos
            });
           }catch(err){
               next(err); // lo maneja el middleware global de errores
           }
    }

//GET estadísticas por categoría
    async estadisticas(req:Request, res:Response, next: NextFunction) {
    try {
            // Agrupamos los productos por categoría calculando stock total y precio promedio
            const agrupado = await ProductosModel.obtenerEstadisticas();

            const estadisticasFormateadas = agrupado.map(grupo => ({
                id_categoria: grupo.id_categoria,
                total_productos: grupo._count.id_producto,
                stock_total: grupo._sum.stock || 0,
                precio_promedio: Number(grupo._avg.precio || 0)
            }));

            return res.status(200).json({ estadisticas: estadisticasFormateadas });

            }catch(err){
                next(err); // lo maneja el middleware global de errores
            }
    }

//POST
    async ingresar(req:Request, res:Response, next: NextFunction) {

         try {
            const { id_categoria, id_proveedor, nombre_producto, descripcion, precio, stock } = req.body;

            if (!id_categoria || !id_proveedor || !nombre_producto || !descripcion || precio === undefined) {
                return res.status(400).json({ error: 'faltan campos obligatorios' });
            }

            const nuevoProducto = await ProductosModel.crear({
                id_categoria: Number(id_categoria),
                id_proveedor: Number(id_proveedor),
                nombre_producto: nombre_producto,
                descripcion: descripcion,
                precio: precio,
                stock: stock !== undefined ? Number(stock) : 0
            });

            return res.status(201).json({
                mensaje: 'Producto creado con éxito',
                id: nuevoProducto.id_producto
            });
           }catch(err){
               next(err); // lo maneja el middleware global de errores
           }
    }


 //GET id
    async consultarDetalle(req:Request, res:Response, next: NextFunction) {
        try {
            const { id } = req.params;

            // El model incluye la info de la categoría y del proveedor vinculados
            const producto = await ProductosModel.obtenerPorId(Number(id));

            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            return res.status(200).json(producto);
            }catch(err){
                next(err); // lo maneja el middleware global de errores
            }
    }
//PUT
    async actualizar(req:Request, res:Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { id_categoria, id_proveedor, nombre_producto, descripcion, precio, stock } = req.body;

            if (!id_categoria || !id_proveedor || !nombre_producto || !descripcion || precio === undefined || stock === undefined) {
                return res.status(400).json({ error: 'faltan campos obligatorios' });
            }

            const productoActualizado = await ProductosModel.actualizar(Number(id), {
                id_categoria: Number(id_categoria),
                id_proveedor: Number(id_proveedor),
                nombre_producto: nombre_producto,
                descripcion: descripcion,
                precio: precio,
                stock: Number(stock)
            });

            return res.status(200).json({
                mensaje: 'Producto actualizado con éxito',
                producto: productoActualizado
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
            const permitidos = ['id_categoria', 'id_proveedor', 'nombre_producto', 'descripcion', 'precio', 'stock'];

            // Nos quedamos solo con los campos permitidos que vinieron en el body
            const campos: Record<string, any> = Object.fromEntries(
                Object.entries(req.body ?? {}).filter(([key]) => permitidos.includes(key))
            );

            if (Object.keys(campos).length === 0) {
                return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar' });
            }

            // Normalizamos tipos numéricos si vienen en los campos dinámicos
            if (campos.id_categoria !== undefined) campos.id_categoria = Number(campos.id_categoria);
            if (campos.id_proveedor !== undefined) campos.id_proveedor = Number(campos.id_proveedor);
            if (campos.stock !== undefined) campos.stock = Number(campos.stock);

            // Verificamos que el producto exista
            const productoExistente = await ProductosModel.obtenerPorId(id);

            if (!productoExistente) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            const productoActualizado = await ProductosModel.actualizarParcial(id, campos);

            return res.status(200).json({
                mensaje: 'Producto actualizado con éxito',
                producto: productoActualizado
            });
             }catch(err){
                 next(err); // lo maneja el middleware global de errores
             }
    }

    async eliminar(req:Request, res:Response, next: NextFunction) {
         try{
            const  id  = Number(req.params.id);

                        const productoExistente = await ProductosModel.obtenerPorId(id);

                        if (!productoExistente) {
                          return res.status(404).json({
                            error: 'Producto no encontrada' });
                        }
                        await ProductosModel.eliminar(id);
                        return res.status(200).json({
                             mensaje: 'Productos eliminada con éxito' });

               }catch(err){
                   next(err); // lo maneja el middleware global de errores
               }
        }

}

export default new ProductosController();
