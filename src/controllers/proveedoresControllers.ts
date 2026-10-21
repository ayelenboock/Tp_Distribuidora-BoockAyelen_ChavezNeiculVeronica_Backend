import type { Request, Response, NextFunction } from 'express';
import ProveedoresModel from '../models/proveedoresModels.js'
import type { ProveedoresCondicionIva } from '../generated/prisma/enums.js';
class ProveedoresController {
    constructor () { }

//GET
    async consultar(req:Request, res:Response, next: NextFunction) {
        try {
            const proveedores = await ProveedoresModel.obtenerTodos();

            return res.status(200).json({
                total: proveedores.length,
                proveedores: proveedores
            });

       }catch(err){
           next(err); // lo maneja el middleware global de errores
       }
    }

//GET proveedores filtrados por condición de IVA
    async consultarPorCondicion(req:Request, res:Response, next: NextFunction) {
        try {
            const { condicion } = req.params;

            // Reemplazamos guiones por guiones bajos y forzamos el tipo del Enum
            const condicionFormateada = String(condicion).replace('-', '_') as ProveedoresCondicionIva;

            const proveedores = await ProveedoresModel.obtenerPorCondicion(condicionFormateada);

            return res.status(200).json({
                total: proveedores.length,
                proveedores: proveedores
            });
           }catch(err){
               next(err); // lo maneja el middleware global de errores
           }
    }

//GET estadísticas: productos y stock por proveedor
    async estadisticas(req:Request, res:Response, next: NextFunction) {
        try {
            // Traemos los proveedores e incluimos el stock de sus productos asociados
            const resultado = await ProveedoresModel.obtenerEstadisticas();

            // Mapeamos los resultados para consolidar las sumas en memoria de forma veloz
            const estadisticasFormateadas = resultado.map(prov => {
                const stockTotal = prov.productos.reduce((acumulado, prod) => acumulado + prod.stock, 0);

                return {
                    id_proveedor: prov.id_proveedor,
                    razon_social: prov.razon_social,
                    cantidad_productos: prov.productos.length,
                    stock_total: stockTotal
                };
            });

            return res.status(200).json({ estadisticas: estadisticasFormateadas });
           }catch(err){
               next(err); // lo maneja el middleware global de errores
           }
    }

//POST
    async ingresar(req:Request, res:Response, next: NextFunction) {
        try {
            const { razon_social, nombre_contacto, telefono, email, direccion, id_ciudad, condicion_iva } = req.body;

            if (!razon_social || !nombre_contacto || !telefono || !email || !direccion || !id_ciudad || !condicion_iva) {
                return res.status(400).json({ error: 'faltan campos obligatorios' });
            }

            const nuevoProveedor = await ProveedoresModel.crear({
                razon_social,
                nombre_contacto,
                telefono,
                email,
                direccion,
                id_ciudad: Number(id_ciudad), // Conversión a número obligatoria
                condicion_iva: condicion_iva as ProveedoresCondicionIva
            });

            return res.status(201).json({
                mensaje: 'Proveedor creado con éxito',
                id: nuevoProveedor.id_proveedor
            });
            }catch(err){
                next(err); // lo maneja el middleware global de errores
            }
    }


 //GET id
    async consultarDetalle(req:Request, res:Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const proveedor = await ProveedoresModel.obtenerPorId(Number(id));

            if (!proveedor) {
                return res.status(404).json({ error: 'Proveedor no encontrado' });
            }

            return res.status(200).json(proveedor);
            }catch(err){
                next(err); // lo maneja el middleware global de errores
            }
    }
//PUT
    async actualizar(req:Request, res:Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { razon_social, nombre_contacto, telefono, email, direccion, id_ciudad, condicion_iva } = req.body;

            if (!razon_social || !nombre_contacto || !telefono || !email || !direccion || !id_ciudad || !condicion_iva) {
                return res.status(400).json({ error: 'faltan campos obligatorios' });
            }

            const proveedorActualizado = await ProveedoresModel.actualizar(Number(id), {
                razon_social,
                nombre_contacto,
                telefono,
                email,
                direccion,
                id_ciudad: Number(id_ciudad),
                condicion_iva: condicion_iva as ProveedoresCondicionIva
            });

            return res.status(200).json({
                mensaje: 'Proveedor actualizado con éxito',
                proveedor: proveedorActualizado
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
            const permitidos = ['razon_social', 'nombre_contacto', 'telefono', 'email', 'direccion', 'id_ciudad', 'condicion_iva'];

            // Nos quedamos solo con los campos permitidos que vinieron en el body
            const campos: Record<string, any> = Object.fromEntries(
                Object.entries(req.body ?? {}).filter(([key]) => permitidos.includes(key))
            );

            if (Object.keys(campos).length === 0) {
                return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar' });
            }

            // Normalizamos tipos numéricos y enums si vienen en los campos parciales
            if (campos.id_ciudad !== undefined) campos.id_ciudad = Number(campos.id_ciudad);
            if (campos.condicion_iva !== undefined) campos.condicion_iva = campos.condicion_iva as ProveedoresCondicionIva;

            // Verificamos que el proveedor exista
            const proveedorExistente = await ProveedoresModel.obtenerPorId(id);

            if (!proveedorExistente) {
                return res.status(404).json({ error: 'Proveedor no encontrado' });
            }

            const proveedorActualizado = await ProveedoresModel.actualizarParcial(id, campos);

            return res.status(200).json({
                mensaje: 'Proveedor actualizado con éxito',
                proveedor: proveedorActualizado
            });
            }catch(err){
                next(err); // lo maneja el middleware global de errores
            }
    }


    async eliminar(req:Request, res:Response, next: NextFunction) {
         try{
            const  id  = Number(req.params.id);

            const ProveedorExistente = await ProveedoresModel.obtenerPorId(id);

                        if (!ProveedorExistente) {
                          return res.status(404).json({
                            error: 'Proveedor no encontrado' });
                        }
                        await ProveedoresModel.eliminar(id);
                        return res.status(200).json({
                             mensaje: 'Proveedor eliminado con éxito' });

                  }catch(err){
                      next(err); // lo maneja el middleware global de errores
                  }
    }

}

export default new ProveedoresController();
