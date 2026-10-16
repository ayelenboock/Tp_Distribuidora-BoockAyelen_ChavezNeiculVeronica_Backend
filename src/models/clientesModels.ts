//import db from '../database/conexion.js'

class ClientesModel {
    async obtenerTodos() { 
        return await db.query('SELECT * FROM clientes');
     }

    async crear({ nombre, apellido, cuit, razon_social, direccion,id_ciudad, telefono, email, dni, condicion_iva }) {
        return await db.query(
                `INSERT INTO clientes (nombre, apellido, cuit, razon_social, direccion, id_ciudad,telefono, email, dni, condicion_iva) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
                [nombre, apellido, cuit, razon_social, direccion, id_ciudad,telefono, email, dni, condicion_iva]
            );
    }
    
       //Filtrar clientes según su condición de IVA
    async obtenerPorCondicion(condicion) {
        return await db.query('SELECT * FROM clientes WHERE condicion_iva = ?', [condicion]);
    }

    //Cantidad de pedidos y total comprado por cliente
    async obtenerEstadisticas() {
        return await db.query(`
            SELECT c.id_cliente, c.nombre, c.apellido, c.razon_social,
                   COUNT(p.id_pedido) AS cantidad_pedidos,
                   COALESCE(SUM(p.total), 0) AS total_comprado
            FROM clientes c
            LEFT JOIN pedidos p ON p.id_cliente = c.id_cliente
            GROUP BY c.id_cliente, c.nombre, c.apellido, c.razon_social
        `);
    }


    async obtenerPorId(id) {
        return await db.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
    }
   
   async actualizar(id, { nombre, apellido, cuit, razon_social, direccion,id_ciudad, telefono, email, dni, condicion_iva }) { 
        return await db.query(
                `UPDATE clientes SET nombre = ?, apellido = ?, cuit = ?, razon_social = ?, direccion = ?,id_ciudad=?, telefono = ?, email = ?, dni = ?, condicion_iva = ? WHERE id_cliente = ?`,
                [nombre, apellido, cuit, razon_social, direccion,id_ciudad, telefono, email, dni, condicion_iva, id]
            );
    }
    
    async eliminar(id) { 
        return await db.query(
                'DELETE FROM clientes WHERE id_cliente = ?', 
                [id]);
     }
    
     async actualizarParcial(id, campos) { 
        const permitidos = ['nombre', 'apellido', 'cuit', 'razon_social', 'direccion','id_ciudad', 'telefono', 'email', 'dni', 'condicion_iva'];
        const keys = Object.keys(campos).filter(key => permitidos.includes(key));

        if (keys.length === 0) {
            const error = new Error('No se proporcionaron campos válidos para actualizar'); 
            error.status = 400;
            throw error;
        }

        const setClause = keys.map(key => `${key} = ?`).join(', ');

        const values = keys.map(key => campos[key]);
        values.push(id); 

        return await db.query(
            `UPDATE clientes SET ${setClause} WHERE id_cliente = ?`, 
            values
        );
     }
}

export default new ClientesModel()