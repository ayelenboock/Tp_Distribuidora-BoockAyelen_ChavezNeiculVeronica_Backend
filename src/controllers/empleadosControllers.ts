import type { Request, Response } from 'express';
//import empleadosModel from '../models/empleadosModels.js';
import { prisma } from "../config/prisma.js";
class EmpleadosController {
    constructor (){}
    
    //GET
    async consultar(req:Request, res:Response) {
        try{
            const empleados = await prisma.empleados.findMany();

            return res.status(200).json({
                total: empleados.length,
                empleados: empleados
            });    
            }catch(err){
              if(err instanceof Error)
                   res.status(500).json({error:err.message});
           }
       }

    //GET empleados filtrados por puesto
    async consultarPorPuesto(req:Request, res:Response) {
        try{
            const {puesto}= req.params;
            const empleados = await prisma.empleados.findMany({
                where: {
                    puesto: {
                        contains:String(puesto),
                        mode: 'insensitive'
                    }
                }
            });
            return res.status(200).json({ 
                total: empleados.length,
                 empleados: empleados
                 });
            }catch(err){
            if(err instanceof Error)
                res.status(500).json({error:err.message});
          }
      }

    //GET estadísticas: pedidos y total vendido por empleado
    async estadisticas(req:Request, res:Response) {
       try {
            // Traemos los empleados junto a sus pedidos asociados
            const resultado = await prisma.empleados.findMany({
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

            // Formateamos las estadísticas sumando las ventas
            const estadisticasFormateadas = resultado.map(empleado => {
                const totalVendido = empleado.pedidos.reduce((acumulado, pedido) => {
                    return acumulado + Number(pedido.total);
                }, 0);

                return {
                    id_empleado: empleado.id_empleado,
                    nombre: empleado.nombre,
                    apellido: empleado.apellido,
                    puesto: empleado.puesto,
                    cantidad_pedidos: empleado.pedidos.length,
                    total_vendido: totalVendido
                };
            });

             res.status(200).json({ estadisticasFormateadas });
        }catch(err){
            if(err instanceof Error)
                return res.status(500).json({error:err.message});
        }
    }

//POST
    async ingresar(req:Request,res:Response){
         try {
            const { nombre, apellido, fecha_de_nac, fecha_de_ingreso, dni, cuil, email, puesto } = req.body;
            
            if (!nombre || !apellido || !fecha_de_nac || !fecha_de_ingreso || !dni || !cuil || !email || !puesto) {
                return res.status(400).json({ error: 'Faltan Campos Obligatorios' });
            }

            const nuevoEmpleado = await prisma.empleados.create({
                data: {
                    nombre,
                    apellido,
                    fecha_de_nac: new Date(fecha_de_nac), // Conversión obligatoria a Date
                    fecha_de_ingreso: new Date(fecha_de_ingreso), // Conversión obligatoria a Date
                    dni,
                    cuil,
                    email,
                    puesto
                }
            });

            return res.status(201).json({
                mensaje: 'Empleado creado con éxito',
                id: nuevoEmpleado.id_empleado 
            });
        }catch(err){
            if(err instanceof Error)
                res.status(500).json({error:err.message});
        }
    }

    //GET id
    async consultarDetalle(req:Request, res:Response) {
        try {
            const { id } = req.params;

            const empleado = await prisma.empleados.findUnique({
                where: {
                    id_empleado: Number(id)
                }
            });

            if (!empleado) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }

            return res.status(200).json(empleado);
          }catch(err){
               if(err instanceof Error)
                 return res.status(500).json({error:err.message});
        }
     }
//PUT
    async actualizar(req:Request, res:Response) {
        try {
            const { id } = req.params;
            const { nombre, apellido, fecha_de_nac, fecha_de_ingreso, dni, cuil, email, puesto } = req.body;

            if (!nombre || !apellido || !fecha_de_nac || !fecha_de_ingreso || !dni || !cuil || !email || !puesto) {
                return res.status(400).json({ error: 'faltan campos obligatorios' });
            }

            const empleadoActualizado = await prisma.empleados.update({
                where: {
                    id_empleado: Number(id)
                },
                data: {
                    nombre,
                    apellido,
                    fecha_de_nac: new Date(fecha_de_nac),
                    fecha_de_ingreso: new Date(fecha_de_ingreso),
                    dni,
                    cuil,
                    email,
                    puesto
                }
            });

            return res.status(200).json({
                mensaje: 'Empleado actualizado con éxito',
                empleado: empleadoActualizado
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

            // Si vienen las fechas en la actualización parcial, las parseamos
            if (campos.fecha_de_nac) campos.fecha_de_nac = new Date(campos.fecha_de_nac);
            if (campos.fecha_de_ingreso) campos.fecha_de_ingreso = new Date(campos.fecha_de_ingreso);

            const empleadoActualizado = await prisma.empleados.update({
                where: {
                    id_empleado: Number(id)
                },
                data: campos
            });
           
            return res.status(200).json({
                mensaje: 'Empleado actualizado con éxito',
                empleado: empleadoActualizado
            });
           }catch(err){
               if(err instanceof Error)
                  return res.status(500).json({error:err.message});
            }
        }

    async eliminar(req:Request, res:Response) {
        try {
            const { id } = req.params;

            await prisma.empleados.delete({
                where: {
                    id_empleado: Number(id)
                }
            });

            return res.status(200).json({ mensaje: 'Empleado eliminado con éxito' });
           
           }catch(err){
                if(err instanceof Error)
                    return  res.status(500).json({error:err.message});
        }
    }

}

export default new EmpleadosController();