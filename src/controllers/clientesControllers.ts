import type { Request, Response, NextFunction } from 'express';
import ClientesModel from '../models/clientesModels.js'
import type { ClientesCondicionIva } from '../generated/prisma/enums.js';


class ClientesController {
    constructor (){}

    //GET
    async consultar(req:Request, res:Response, next: NextFunction) {
       try{
         const clientes= await ClientesModel.obtenerTodos();

         return res.status(200).json({
            total: clientes.length,
            clientes: clientes
          });

        }catch(err){
            next(err); // lo maneja el middleware global de errores
        }
    }


    //GET clientes filtrados por condición de IVA
async consultarPorCondicion(req: Request, res: Response, next: NextFunction) {
    try {
        const { condicion } = req.params;

        // Normalizamos el parámetro reemplazando guiones y forzando el tipo del Enum
        const condicionFormateada = String(condicion).replace('-', '_') as ClientesCondicionIva;

        // Consultamos filtrando por la condición de IVA (el model incluye los datos de la ciudad)
        const clientes = await ClientesModel.obtenerPorCondicion(condicionFormateada);

        return res.status(200).json({
            total: clientes.length,
            clientes: clientes
        });

    } catch (err) {
        next(err); // lo maneja el middleware global de errores
    }
}


    //GET estadísticas: pedidos y total comprado por cliente
    async estadisticas(req:Request, res:Response, next: NextFunction) {
       try{
        const resultado = await ClientesModel.obtenerEstadisticas();
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
            next(err); // lo maneja el middleware global de errores
        }
    }

    //POST
    async ingresar(req:Request,res:Response, next: NextFunction){
        try {
        const { nombre, apellido, cuit, razon_social, direccion, id_ciudad, telefono, email, dni, condicion_iva } = req.body;

        // Validación de campos obligatorios
        if (!nombre || !apellido || !cuit || !razon_social || !direccion || !id_ciudad || !telefono || !email || !dni || !condicion_iva) {
            return res.status(400).json({ error: 'Faltan Campos Obligatorios' });
        }

        // Creamos el registro a través del model
        const nuevoCliente = await ClientesModel.crear({
            nombre: nombre,
            apellido: apellido,
            cuit: cuit,
            razon_social: razon_social,
            direccion: direccion,
            id_ciudad: Number(id_ciudad), // Convertimos obligatoriamente a número
            telefono: telefono,
            email: email,
            dni: dni,
            condicion_iva: condicion_iva as ClientesCondicionIva
        });

        // Prisma nos devuelve el objeto creado directamente con su 'id_cliente'
        return res.status(201).json({
            mensaje: 'Cliente creado con éxito',
            id: nuevoCliente.id_cliente
        });

        } catch (err) {
            next(err); // lo maneja el middleware global de errores
        }
    }


    //GET id
    async consultarDetalle(req:Request, res:Response, next: NextFunction) {
        try{
            const { id } = req.params;

            const cliente = await ClientesModel.obtenerPorId(Number(id));

            if (!cliente) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }

            return res.status(200).json(cliente);
        }catch(err){
            next(err); // lo maneja el middleware global de errores
        }
    }
//PUT
    async actualizar(req:Request, res:Response, next: NextFunction) {
        try{
            const  id  = Number(req.params.id);
            const { nombre, apellido, cuit, razon_social, direccion, id_ciudad,telefono, email, dni, condicion_iva } = req.body;

            if (!nombre || !apellido || !cuit || !razon_social || !direccion ||!id_ciudad|| !telefono || !email || !dni || !condicion_iva) {
                return res.status(400).json({error: 'faltan campos obligatorios'});
            }

            const clienteActualizado = await ClientesModel.actualizar(id, {
                nombre:nombre,
                apellido:apellido,
                cuit: cuit,
                razon_social:razon_social,
                direccion: direccion,
                id_ciudad:Number(id_ciudad),
                telefono:telefono,
                email:email,
                dni: dni,
                condicion_iva: condicion_iva as ClientesCondicionIva
            });

        // Prisma nos entrega el registro modificado de forma directa
        return res.status(200).json({
            mensaje: 'Cliente actualizado con éxito',
            cliente: clienteActualizado
        });
           }catch(err){
               next(err); // lo maneja el middleware global de errores
           }
    }
//PATCH
    async actualizarParcial(req:Request, res:Response, next: NextFunction) {
        try{
            const id = Number(req.params.id);

            // Lista de columnas que se pueden modificar
            const permitidos = ['nombre', 'apellido', 'cuit', 'razon_social', 'direccion', 'id_ciudad', 'telefono', 'email', 'dni', 'condicion_iva'];

            // Nos quedamos solo con los campos permitidos que vinieron en el body
            const campos: Record<string, any> = Object.fromEntries(
                Object.entries(req.body ?? {}).filter(([key]) => permitidos.includes(key))
            );

            // Validación de que el cuerpo no venga vacío
            if (Object.keys(campos).length === 0) {
               return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar' });
            }

             // Si en los campos viene 'id_ciudad', nos aseguramos de que sea un número
            if (campos.id_ciudad !== undefined) {
               campos.id_ciudad = Number(campos.id_ciudad);
            }

            // Verificamos que el cliente exista
            const clienteExistente = await ClientesModel.obtenerPorId(id);

            if (!clienteExistente) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }

            // Prisma se encarga de actualizar dinámicamente solo las propiedades que vengan en 'campos'
            const clienteActualizado = await ClientesModel.actualizarParcial(id, campos);

           // Retornamos directamente el objeto modificado que nos devuelve Prisma
            return res.status(200).json({
               mensaje: 'Cliente actualizado con éxito',
               cliente: clienteActualizado
           });
         }catch(err){
             next(err); // lo maneja el middleware global de errores
         }
    }

    async eliminar(req:Request, res:Response, next: NextFunction) {
        try{
            const  id  = Number(req.params.id);

                        const clienteExistente = await ClientesModel.obtenerPorId(id);

                        if (!clienteExistente) {
                          return res.status(404).json({
                            error: 'Cliente no encontrada' });
                        }
                        await ClientesModel.eliminar(id);
                        return res.status(200).json({
                             mensaje: 'Clientes eliminada con éxito' });

           }catch(err){
               next(err); // lo maneja el middleware global de errores
           }
    }

}

export default new ClientesController();
