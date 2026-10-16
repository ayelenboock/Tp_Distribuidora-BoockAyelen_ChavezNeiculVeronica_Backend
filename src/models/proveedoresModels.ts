//import db from '../database/conexion.js'

class ProveedoresModel {
    async obtenerTodos() { 
        return await db.query('SELECT * FROM proveedores');
     }
    
    // Filtrar proveedores según su condición de IVA
    async obtenerPorCondicion(condicion) {
        return await db.query('SELECT * FROM proveedores WHERE condicion_iva = ?', [condicion]);
    }

    //Cantidad de productos y stock por proveedor
    async obtenerEstadisticas() {
        return await db.query(`
            SELECT pv.id_proveedor, pv.razon_social,
                   COUNT(pr.id_producto) AS cantidad_productos,
                   COALESCE(SUM(pr.stock), 0) AS stock_total
            FROM proveedores pv
            LEFT JOIN productos pr ON pr.id_proveedor = pv.id_proveedor
            GROUP BY pv.id_proveedor, pv.razon_social
        `);
    }

    async crear({ razon_social, nombre_contacto, telefono, email, direccion, id_ciudad,condicion_iva }) {
        return await db.query(
                `INSERT INTO proveedores (razon_social, nombre_contacto, telefono, email, direccion,id_ciudad, condicion_iva) VALUES (?,?, ?, ?, ?, ?, ?)`,
                [razon_social, nombre_contacto, telefono, email, direccion, id_ciudad,condicion_iva]
            );
    }

    async obtenerPorId(id) {
        return await db.query('SELECT * FROM proveedores WHERE id_proveedor = ?', [id]);
    }

    async actualizar(id, { razon_social, nombre_contacto, telefono, email, direccion,id_ciudad, condicion_iva }) { 
        return await db.query(
                `UPDATE proveedores SET razon_social = ?, nombre_contacto = ?, telefono = ?, email = ?, direccion = ?, id_ciudad=?,condicion_iva = ? WHERE id_proveedor = ?`,
                [razon_social, nombre_contacto, telefono, email, direccion,id_ciudad, condicion_iva, id]
            );
    }

    async eliminar(id) { 
        return await db.query(
                'DELETE FROM proveedores WHERE id_proveedor = ?', 
                [id]);
    }

    async actualizarParcial(id, campos) { 
        const permitidos = ['razon_social', 'nombre_contacto', 'telefono', 'email', 'direccion','id_ciudad', 'condicion_iva'];
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
            `UPDATE proveedores SET ${setClause} WHERE id_proveedor = ?`, 
            values
        );
     }
}

export default new ProveedoresModel()