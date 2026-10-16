//import db from '../database/conexion.js'

class EmpleadosModel {
    async obtenerTodos() { 
        return await db.query('SELECT * FROM empleados');
     }

    // Filtrar: empleados de un puesto
    async obtenerPorPuesto(puesto) {
        return await db.query('SELECT * FROM empleados WHERE puesto = ?', [puesto]);
    }

    //Cantidad de pedidos y total vendido por empleado
    async obtenerEstadisticas() {
        return await db.query(`
            SELECT e.id_empleado, e.nombre, e.apellido,
                   COUNT(p.id_pedido) AS cantidad_pedidos,
                   COALESCE(SUM(p.total), 0) AS total_vendido
            FROM empleados e
            LEFT JOIN pedidos p ON p.id_empleado = e.id_empleado
            GROUP BY e.id_empleado, e.nombre, e.apellido
        `);
    } 

    async crear({ nombre, apellido, fecha_de_nac, fecha_de_ingreso, dni, cuil, email, puesto }) {
        return await db.query(
                `INSERT INTO empleados (nombre, apellido, fecha_de_nac, fecha_de_ingreso, dni, cuil, email, puesto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [nombre, apellido, fecha_de_nac, fecha_de_ingreso, dni, cuil, email, puesto]
            );
     }
    async obtenerPorId(id) {
        return await db.query('SELECT * FROM empleados WHERE id_empleado = ?', [id]);
   }
    async actualizar(id, { nombre, apellido, fecha_de_nac, fecha_de_ingreso, dni, cuil, email, puesto }) { 
        return await db.query(
                `UPDATE empleados SET nombre = ?, apellido = ?, fecha_de_nac = ?, fecha_de_ingreso = ?, dni = ?, cuil = ?, email = ?, puesto = ? WHERE id_empleado = ?`,
                [nombre, apellido, fecha_de_nac, fecha_de_ingreso, dni, cuil, email, puesto, id]
            );
    }
    async eliminar(id) { 
        return await db.query(
                'DELETE FROM empleados WHERE id_empleado = ?', 
                [id]);
     }
    async actualizarParcial(id, campos) { 
        const permitidos = ['nombre', 'apellido', 'fecha_de_nac', 'fecha_de_ingreso', 'dni', 'cuil', 'email', 'puesto'];
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
            `UPDATE empleados SET ${setClause} WHERE id_empleado = ?`, 
            values
        );
     }
}

export default new EmpleadosModel()