//import db from '../database/conexion.js'

class CompaniasEnvioModel {
    async obtenerTodos() { 
        return await db.query('SELECT * FROM compania_envio');
    }

    // Filtrar compañías por nombre
    async buscarPorNombre(texto) {
        return await db.query('SELECT * FROM compania_envio WHERE nombre LIKE ?', [`%${texto}%`]);
    }

    //Cantidad de envíos por compañía
    async obtenerEstadisticas() {
        return await db.query(`
            SELECT ce.id_compania, ce.nombre,
                   COUNT(p.id_pedido) AS cantidad_envios
            FROM compania_envio ce
            LEFT JOIN pedidos p ON p.id_compania = ce.id_compania
            GROUP BY ce.id_compania, ce.nombre
        `);
    }

    async crear({ nombre, telefono, direccion,id_ciudad }) {
        return await db.query( 
                `INSERT INTO compania_envio (nombre, telefono, direccion,id_ciudad) VALUES (?, ?, ?,?)`,
                [nombre, telefono, direccion,id_ciudad]
            );
    }
    async obtenerPorId(id) {
        return await db.query('SELECT * FROM compania_envio WHERE id_compania = ?', [id]);
   }
    async actualizar(id, { nombre, telefono, direccion ,id_ciudad}) { 
        return await db.query(
                `UPDATE compania_envio SET nombre = ?, telefono = ?, direccion = ?,id_ciudad=? WHERE id_compania = ?`,
                [nombre, telefono, direccion,id_ciudad, id]
            );
    }
    async eliminar(id) { 
        return await db.query(
                'DELETE FROM compania_envio WHERE id_compania = ?', 
                [id]);
     }
    async actualizarParcial(id, campos) { 
        const permitidos = ['nombre', 'telefono', 'direccion','id_ciudad'];
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
            `UPDATE compania_envio SET ${setClause} WHERE id_compania = ?`, 
            values
        );
     }
}

export default new CompaniasEnvioModel()