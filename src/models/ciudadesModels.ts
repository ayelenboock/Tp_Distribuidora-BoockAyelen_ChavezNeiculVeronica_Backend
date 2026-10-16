//import db from '../database/conexion.js'

class CiudadesModel {
    async obtenerTodos() { 
        return await db.query('SELECT * FROM ciudades');
    }

    // Filtrar ciudad por nombre
    async buscarPorNombre(texto) {
        return await db.query('SELECT * FROM ciudades WHERE nombre LIKE ?', [`%${texto}%`]);
    }

    //Unidades vendidas por ciudad
    async obtenerEstadisticas() {
        return await db.query(`
            SELECT c.id_ciudad, c.nombre,
                   COALESCE(SUM(d.cantidad), 0) AS unidades_vendidas
            FROM ciudades c
            LEFT JOIN productos pr ON pr.id_ciudad = c.id_ciudad
            LEFT JOIN detalles_pedidos d ON d.id_producto = pr.id_producto
            GROUP BY c.id_ciudad, c.nombre
        `);
    }



    async crear({ nombre }) {
        return await db.query( 
                `INSERT INTO ciudades (nombre) VALUES (?)`,
                [nombre]
            );
    }

    async obtenerPorId(id) {
        return await db.query('SELECT * FROM ciudades WHERE id_ciudad = ?', [id]);
    }
    async actualizar(id, { nombre }) { 
        return await db.query(
                `UPDATE ciudades SET nombre = ? WHERE id_ciudad = ?`,
                [nombre, id]
            );
    }
    async eliminar(id) { 
        return await db.query(
                'DELETE FROM ciudades WHERE id_ciudad = ?', 
                [id]);
     }
    async actualizarParcial(id, campos) { 
        const permitidos = ['nombre'];
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
            `UPDATE ciudades SET ${setClause} WHERE id_ciudad = ?`, 
            values
        );
     }
}

export default new CiudadesModel()