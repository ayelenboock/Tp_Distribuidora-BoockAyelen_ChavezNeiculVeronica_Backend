import type { Request, Response } from 'express';
//import ClientesModel from '../models/clientesModels.js'
import {prisma} from "../config/prisma.js";
//import type { ClientesCondicionIva } from '../generated/prisma/enums.js';


class ClientesController {
    constructor (){}

    //GET
    async consultar(req:Request, res:Response) {
       try{
         const clientes= await prisma.clientes.findMany();

         return res.status(200).json({
            total: clientes.length,
            clientes: clientes
          });
       
        }catch(err){
            if(err instanceof Error)
               return  res.status(500).json({error:err.message});
        }
    }

    
    //GET clientes filtrados por condición de IVA
async consultarPorCondicion(req: Request, res: Response) {
    try {
        const { condicion } = req.params;

        // Normalizamos el parámetro reemplazando guiones y forzando el tipo del Enum
        const condicionFormateada = String(condicion).replace('-', '_') as any;

        // Consultamos a Prisma filtrando por la condición de IVA
        const clientes = await prisma.clientes.findMany({
            where: {
                condicion_iva: condicionFormateada
            },
            include: {
                ciudad: true // Opcional: nos trae los datos de la ciudad del cliente automáticamente
            }
        });

        return res.status(200).json({ 
            total: clientes.length, 
            clientes: clientes 
        });

    } catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({ error: err.message });
        }
    }
}


    //GET estadísticas: pedidos y total comprado por cliente
    async estadisticas(req:Request, res:Response) {
       try{
        const resultado = await prisma.clientes.findMany({
            select: {
                id_cliente: true,
                nombre: true,
                apellido: true,
                cuit: true,
                pedidos: {
                    select: {
                        total: true
                    }
                }
            }
        });
        // Formateamos los datos calculando la cantidad de pedidos y el total sumado
        const estadisticasFormateadas = resultado.map(cliente => {
            // Sumamos todos los totales de los pedidos del cliente
            const totalComprado = cliente.pedidos.reduce((acumulado, pedido) => {
                // Convertimos el tipo Decimal de Prisma a número estándar de JS
                return acumulado + Number(pedido.total);
            }, 0);

            return {
                id_cliente: cliente.id_cliente,
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                cuit: cliente.cuit,
                cantidad_pedidos: cliente.pedidos.length, // Conteo de pedidos
                total_comprado: totalComprado // Suma total gastada
            };
        });
         return res.status(200).json({ estadisticasFormateadas });
        }catch(err){
            if(err instanceof Error)
                return res.status(500).json({error:err.message});
        }
    }

    //POST
    async ingresar(req:Request,res:Response){
        try {
        const { nombre, apellido, cuit, razon_social, direccion, id_ciudad, telefono, email, dni, condicion_iva } = req.body;
        
        // Validación de campos obligatorios
        if (!nombre || !apellido || !cuit || !razon_social || !direccion || !id_ciudad || !telefono || !email || !dni || !condicion_iva) {
            return res.status(400).json({ error: 'Faltan Campos Obligatorios' });
        }

        // Creamos el registro en Prisma pasando los datos en el objeto 'data'
        const nuevoCliente = await prisma.clientes.create({
            data: {
                nombre: nombre,
                apellido: apellido,
                cuit: cuit,
                razon_social: razon_social,
                direccion: direccion,
                id_ciudad: Number(id_ciudad), // Convertimos obligatoriamente a número
                telefono: telefono,
                email: email,
                dni: dni,
                condicion_iva: condicion_iva as any
            }
        });

        // Prisma nos devuelve el objeto creado directamente con su 'id_cliente'
        return res.status(201).json({
            mensaje: 'Cliente creado con éxito',
            id: nuevoCliente.id_cliente  
        });
        
        } catch (err) {
        if (err instanceof Error) {
                return res.status(500).json({ error: err.message });
        }
    }
    }


    //GET id
    async consultarDetalle(req:Request, res:Response) {
        try{
            const { id } = req.params;

            const cliente = await prisma.clientes.findUnique({
                where: {
                    id_cliente:Number(id)
                }
            });

            if (!cliente) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }

            return res.status(200).json(cliente);
        }catch(err){
            if(err instanceof Error)
                return res.status(500).json({error:err.message});
        }
    }
//PUT
    async actualizar(req:Request, res:Response) {
        try{
            const  id  = Number(req.params.id);
            const { nombre, apellido, cuit, razon_social, direccion, id_ciudad,telefono, email, dni, condicion_iva } = req.body;

            if (!nombre || !apellido || !cuit || !razon_social || !direccion ||!id_ciudad|| !telefono || !email || !dni || !condicion_iva) {
                return res.status(400).json({error: 'faltan campos obligatorios'});
            }

            const clienteActualizado = await prisma.clientes.update( {
                where: {

                id_cliente: id},
                data: {
                    nombre:nombre,
                    apellido:apellido,
                    cuit: cuit, 
                    razon_social:razon_social,
                     direccion: direccion,
                      id_ciudad:Number(id_ciudad),
                      telefono:telefono,
                       email:email,
                       dni: dni,
                condicion_iva: condicion_iva as any
            }
        });

        // Prisma nos entrega el registro modificado de forma directa
        return res.status(200).json({
            mensaje: 'Cliente actualizado con éxito',
            cliente: clienteActualizado
        });
           }catch(err){
             if(err instanceof Error)
               return  res.status(500).json({error:err.message});
        }
    }
//PATCH
    async actualizarParcial(req:Request, res:Response) {
        try{
            const { id } = req.params;
            const campos = req.body;
          
            // Validación de que el cuerpo no venga vacío
            if (!campos || Object.keys(campos).length === 0) {
               return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
            }

             // Si en los campos viene 'id_ciudad', nos aseguramos de que sea un número
            if (campos.id_ciudad !== undefined) {
               campos.id_ciudad = Number(campos.id_ciudad);
            }

            // Prisma se encarga de actualizar dinámicamente solo las propiedades que vengan en 'campos'
            const clienteActualizado = await prisma.clientes.update({
              where: {
                 id_cliente: Number(id)
              },
              data: campos
            });

           // Retornamos directamente el objeto modificado que nos devuelve Prisma
            return res.status(200).json({
               mensaje: 'Cliente actualizado con éxito',
               cliente: clienteActualizado
           });
         }catch(err){
            if(err instanceof Error)
                res.status(500).json({error:err.message});
        }
    }

    async eliminar(req:Request, res:Response) {
        try{
            const  id  = Number(req.params.id);
            
                        const clienteExistente = await prisma.clientes.findUnique({
                            where: {
                                id_cliente: Number(id)
            
                            }
                        });
            
                        if (!clienteExistente) {
                          return res.status(404).json({ 
                            error: 'Cliente no encontrada' });
                        }
                        await prisma.clientes.delete({
                            where: {
                                id_cliente: Number(id)
                            }
                        });
                        return res.status(200).json({
                             mensaje: 'Clientes eliminada con éxito' });
        
           }catch(err){
               if(err instanceof Error)
                   return res.status(500).json({error:err.message});
        }
    }

}

export default new ClientesController();