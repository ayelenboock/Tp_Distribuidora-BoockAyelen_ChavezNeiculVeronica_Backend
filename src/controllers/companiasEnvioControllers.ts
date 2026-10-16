import type { Request, Response } from 'express';
//import CompaniasEnvioModel from '../models/companiasEnvioModels.js';
import { prisma } from "../config/prisma.js";

class CompaniasEnvioController {
  constructor() {}

 //GET
    async consultar(req:Request, res:Response) {
       try{ 
        const companias = await prisma.companiaEnvio.findMany();
       
        return res.status(200).json({
            total: companias.length,
            companias: companias
        });  

        }catch(err){
          if (err instanceof Error)
              return res.status(500).json({error:err.message});
    }
   }

    //GET compañías por nombre
    async buscar(req:Request, res:Response) {
        try {
        const { texto } = req.params;

        // Consultamos en la tabla companiaEnvio buscando coincidencias en la columna nombre
        const result = await prisma.companiaEnvio.findMany({
            where: {
                nombre: {
                    contains: String(texto),
                    mode: 'insensitive' // para MAYÚSCULAS y minúsculas
                }
            }
        });

        return res.status(200).json({ 
            total: result.length, 
            companias: result 
        });
        }catch(err){
           if (err instanceof Error)
                return res.status(500).json({error:err.message});
    }
   }

    //GET envíos por compañía
    async estadisticas(req:Request, res:Response) {
        try {
        // Consultamos las compañías de envío y le pedimos a Prisma que cuente sus pedidos
        const resultado = await prisma.companiaEnvio.findMany({
            select: {
                id_compania: true,
                nombre: true,
                _count: {
                    select: {
                        pedidos: true // Cuenta cuántos pedidos fueron enviados por esta compañía
                    }
                }
            }
        });

        // Formateamos la respuesta para que devuelva un formato limpio y descriptivo
        const estadisticasFormateadas = resultado.map(compania => ({
            id_compania: compania.id_compania,
            nombre: compania.nombre,
            total_envios: compania._count.pedidos
        }));

        return res.status(200).json({ estadisticas: estadisticasFormateadas });

        }catch(err){
           if (err instanceof Error)
                return res.status(500).json({error:err.message});
        }
       }

    //POST
    async ingresar(req:Request,res:Response){
        try{
            const {nombre, telefono, direccion,id_ciudad} = req.body;
             if ( !nombre|| !telefono || !direccion||!id_ciudad){
             return res.status(400).json({error: 'Faltan Campos Obligatorios'});
            }
            const nuevaCompania = await prisma.companiaEnvio.create({
                data: {
                    nombre: nombre,
                    telefono: telefono,
                    direccion: direccion, 
                    id_ciudad: Number(id_ciudad)
                }
            });

            return res.status(201).json({
                mensaje: 'Compañía de envio creada con éxito',
                id: nuevaCompania.id_compania  
            });
            
           }catch(err){
              if (err instanceof Error)
                res.status(500).json({error:err.message});
           }
         }
    //GET id
    async consultarDetalle(req:Request, res:Response) {
        try {
        const { nombre, telefono, direccion, id_ciudad } = req.body;
        
        // Validación de campos obligatorios
        if (!nombre || !telefono || !direccion || !id_ciudad) {
             return res.status(400).json({ error: 'Faltan Campos Obligatorios' });
        }

        // Creamos el registro en Prisma pasando los valores dentro de 'data'
        const nuevaCompania = await prisma.companiaEnvio.create({
            data: {
                nombre: nombre,
                telefono: telefono,
                direccion: direccion,
                id_ciudad: Number(id_ciudad) // Conversión a número obligatoria
            }
        });

        // Prisma nos devuelve el objeto creado directamente con su 'id_compania'
        return res.status(201).json({
            mensaje: 'Compañía de envio creada con éxito',
            id: nuevaCompania.id_compania  
        });

        }catch(err){
           if (err instanceof Error)
              return  res.status(500).json({error:err.message});
          }
       }
//PUT
    async actualizar(req:Request, res:Response) {
        try {
        const { id } = req.params;
        const { nombre, telefono, direccion, id_ciudad } = req.body;

        // Validación de campos obligatorios
        if (!nombre || !telefono || !direccion || !id_ciudad) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        // Actualizamos en la base de datos usando Prisma
        const companiaActualizada = await prisma.companiaEnvio.update({
            where: {
                id_compania: Number(id)
            },
            data: {
                nombre: nombre,
                telefono: telefono,
                direccion: direccion,
                id_ciudad: Number(id_ciudad) // Conversión a número obligatoria
            }
        });

        // Prisma nos devuelve el registro recién modificado de forma directa
        return res.status(200).json({
            mensaje: 'Compañía de envio actualizada con éxito',
            compania: companiaActualizada
        });
           
        }catch(err){
            if (err instanceof Error)
                return res.status(500).json({error:err.message});
          }
       }
//PATCH
    async actualizarParcial(req:Request, res:Response) {
            try {
        const { id } = req.params;
        const campos = req.body;

        // Validación de que el cuerpo no venga vacío
        if (!campos || Object.keys(campos).length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
        }

        // Si se envió id_ciudad para actualizar, garantizamos que sea un número
        if (campos.id_ciudad !== undefined) {
            campos.id_ciudad = Number(campos.id_ciudad);
        }
    
        // Prisma actualiza dinámicamente solo las propiedades que vengan en req.body
        const companiaActualizada = await prisma.companiaEnvio.update({
            where: {
                id_compania: Number(id)
            },
            data: campos
        });

        // Retornamos directamente el objeto modificado que nos devuelve Prisma
        return res.status(200).json({
            mensaje: 'Compañía de envio actualizada con éxito',
            compania: companiaActualizada
        });

        }catch(err){
        if (err instanceof Error)
            res.status(500).json({error:err.message});
        }
    }

    async eliminar(req:Request, res:Response) {
        try{
            const id  = Number(req.params.id);
            const companiaExistente = await prisma.companiaEnvio.findUnique({
             where: {
                id_compania: id
            }
         });

        if (!companiaExistente) {
            return res.status(404).json({ error: 'Compañía de envio no encontrada' });
        }

        // Si existe, procedemos a eliminarla de la base de datos
        await prisma.companiaEnvio.delete({
            where: {
                id_compania: id
            }
        });
          res.status(200).json({ mensaje: 'Compañía de envio eliminada con éxito' });
        }catch(err){
        if (err instanceof Error)
            res.status(500).json({error:err.message});
    }
    }
}
export default new CompaniasEnvioController();