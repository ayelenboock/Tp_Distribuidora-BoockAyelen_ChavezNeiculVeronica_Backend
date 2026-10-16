import db from '../database/conexion.js';
class ProductosModel {
    async obtenerTodos() {
        return await db.query(`
            SELECT pr.*,
                   c.nombre AS categoria_nombre,
                   pv.razon_social AS proveedor_razon_social
            FROM productos pr
            JOIN categorias c ON pr.id_categoria = c.id_categoria
            JOIN proveedores pv ON pr.id_proveedor = pv.id_proveedor
            `);
    }
    async crear({ id_categoria, id_proveedor, nombre_producto, descripcion, precio, stock = 0 }) {
        return await db.query(`INSERT INTO productos (id_categoria, id_proveedor, nombre_producto, descripcion, precio, stock) VALUES (?, ?, ?, ?, ?, ?)`, [id_categoria, id_proveedor, nombre_producto, descripcion, precio, stock]);
    }
    // Filtrar productos por categoría
    async obtenerPorCategoria(idCategoria) {
        return await db.query('SELECT * FROM productos WHERE id_categoria = ?', [idCategoria]);
    }
    // Estadísticas de productos por categoría
    async obtenerEstadisticas() {
        return await db.query(`
            SELECT c.nombre AS categoria,
                   COUNT(pr.id_producto) AS cantidad_productos,
                   ROUND(AVG(pr.precio), 2) AS precio_promedio,
                   SUM(pr.stock) AS stock_total
            FROM categorias c
            LEFT JOIN productos pr ON pr.id_categoria = c.id_categoria
            GROUP BY c.id_categoria, c.nombre
        `);
    }
    async obtenerPorId(id) {
        return await db.query(`
            SELECT pr.*,
                   c.nombre AS categoria_nombre,
                   pv.razon_social AS proveedor_razon_social
            FROM productos pr
            JOIN categorias c ON pr.id_categoria = c.id_categoria
            JOIN proveedores pv ON pr.id_proveedor = pv.id_proveedor
             WHERE pr.id_producto = ?`, [id]);
    }
    async actualizar(id, { id_categoria, id_proveedor, nombre_producto, descripcion, precio, stock }) {
        return await db.query(`UPDATE productos SET id_categoria = ?, id_proveedor = ?, nombre_producto = ?, descripcion = ?, precio = ?, stock = ? WHERE id_producto = ?`, [id_categoria, id_proveedor, nombre_producto, descripcion, precio, stock, id]);
    }
    async eliminar(id) {
        return await db.query('DELETE FROM productos WHERE id_producto = ?', [id]);
    }
    async actualizarParcial(id, campos) {
        const permitidos = ['id_categoria', 'id_proveedor', 'nombre_producto', 'descripcion', 'precio', 'stock'];
        const keys = Object.keys(campos).filter(key => permitidos.includes(key));
        if (keys.length === 0) {
            const error = new Error('No se proporcionaron campos válidos para actualizar');
            error.status = 400;
            throw error;
        }
        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const values = keys.map(key => campos[key]);
        values.push(id);
        return await db.query(`UPDATE productos SET ${setClause} WHERE id_producto = ?`, values);
    }
}
export default new ProductosModel();
//# sourceMappingURL=productosModels.js.map