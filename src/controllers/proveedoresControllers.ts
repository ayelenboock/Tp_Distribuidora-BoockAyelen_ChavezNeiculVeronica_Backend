import type { Request, Response } from 'express';
//import ProveedoresModel from '../models/proveedoresModels.js'
import { prisma } from "../config/prisma.js";
//import { ProveedoresCondicionIva } from '@prisma/client';
class ProveedoresController {
    constructor () { }

//GET
    async consultar(req:Request, res:Response) {
        try {
            const proveedores = await prisma.proveedores.findMany();

            return res.status(200).json({
                total: proveedores.length,
                proveedores: proveedores
            });
       
       }catch(err){
            if(err instanceof Error)
                res.status(500).json({error:err.message});
        }
    }

//GET proveedores filtrados por condición de IVA
    async consultarPorCondicion(req:Request, res:Response) {
        try {
            const { condicion } = req.params;

            // Reemplazamos guiones por guiones bajos y forzamos el tipo del Enum
            const condicionFormateada = String(condicion).replace('-', '_') as any;

            const proveedores = await prisma.proveedores.findMany({
                where: {
                    condicion_iva: condicionFormateada
                }
            });

            return res.status(200).json({ 
                total: proveedores.length, 
                proveedores: proveedores 
            });
           }catch(err){
                if(err instanceof Error)
                    return  res.status(500).json({error:err.message});
        }
    }

//GET estadísticas: productos y stock por proveedor
    async estadisticas(req:Request, res:Response) {
        try {
            // Traemos los proveedores e incluimos el stock de sus productos asociados
            const resultado = await prisma.proveedores.findMany({
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
                 if(err instanceof Error)
                        return res.status(500).json({error:err.message});
        }
    }

//POST
    async ingresar(req:Request, res:Response) {
        try {
            const { razon_social, nombre_contacto, telefono, email, direccion, id_ciudad, condicion_iva } = req.body;

            if (!razon_social || !nombre_contacto || !telefono || !email || !direccion || !id_ciudad || !condicion_iva) {
                return res.status(400).json({ error: 'faltan campos obligatorios' });
            }
            
            const nuevoProveedor = await prisma.proveedores.create({
                data: {
                    razon_social,
                    nombre_contacto,
                    telefono,
                    email,
                    direccion,
                    id_ciudad: Number(id_ciudad), // Conversión a número obligatoria
                    condicion_iva: condicion_iva as any
                }
            });

            return res.status(201).json({
                mensaje: 'Proveedor creado con éxito',
                id: nuevoProveedor.id_proveedor
            });
            }catch(err){
                if(err instanceof Error)
                       return res.status(500).json({error:err.message});
        }
    }
    

 //GET id
    async consultarDetalle(req:Request, res:Response) {
        try {
            const { id } = req.params;

            const proveedor = await prisma.proveedores.findUnique({
                where: {
                    id_proveedor: Number(id)
                }
            });

            if (!proveedor) {
                return res.status(404).json({ error: 'Proveedor no encontrado' });
            }

            return res.status(200).json(proveedor);
            }catch(err){
                if(err instanceof Error)
                       return res.status(500).json({error:err.message});
        }
    }
//PUT
    async actualizar(req:Request, res:Response) {
        try {
            const { id } = req.params;
            const { razon_social, nombre_contacto, telefono, email, direccion, id_ciudad, condicion_iva } = req.body;

            if (!razon_social || !nombre_contacto || !telefono || !email || !direccion || !id_ciudad || !condicion_iva) {
                return res.status(400).json({ error: 'faltan campos obligatorios' });
            }

            const proveedorActualizado = await prisma.proveedores.update({
                where: {
                    id_proveedor: Number(id)
                },
                data: {
                    razon_social,
                    nombre_contacto,
                    telefono,
                    email,
                    direccion,
                    id_ciudad: Number(id_ciudad),
                    condicion_iva: condicion_iva as any
                }
            });

            return res.status(200).json({
                mensaje: 'Proveedor actualizado con éxito',
                proveedor: proveedorActualizado
            });
            }catch(err){
                 if(err instanceof Error)
                       return res.status(500).json({error:err.message});
        }
    }
//PATCH
    async actualizarParcial(req:Request, res:Response) {
        try {
            const { id } = req.params;
            const campos = req.body;

            if (!campos || Object.keys(campos).length === 0) {
                return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
            }

            // Normalizamos tipos numéricos y enums si vienen en los campos parciales
            if (campos.id_ciudad !== undefined) campos.id_ciudad = Number(campos.id_ciudad);
            if (campos.condicion_iva !== undefined) campos.condicion_iva = campos.condicion_iva as any;
         
            const proveedorActualizado = await prisma.proveedores.update({
                where: {
                    id_proveedor: Number(id)
                },
                data: campos
            });

            return res.status(200).json({
                mensaje: 'Proveedor actualizado con éxito',
                proveedor: proveedorActualizado
            });
            }catch(err){
                if(err instanceof Error)
                      res.status(500).json({error:err.message});
        }
    }


    async eliminar(req:Request, res:Response) {
         try{
            const  id  = Number(req.params.id);
            
            const ProveedorExistente = await prisma.proveedores.findUnique({
                 where: {
                        id_proveedor: Number(id)
            
                        }
                        });
            
                        if (!ProveedorExistente) {
                          return res.status(404).json({ 
                            error: 'Proveedor no encontrado' });
                        }
                        await prisma.proveedores.delete({
                            where: {
                                id_proveedor: Number(id)
                            }
                        });
                        return res.status(200).json({
                             mensaje: 'Proveedor eliminado con éxito' });
    
                  }catch(err){
                       if(err instanceof Error)
                             return  res.status(500).json({error:err.message});
        }
    }

}

export default new ProveedoresController();