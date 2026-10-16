import db from '../database/conexion.js';
class CategoriasModel {
    async obtenerTodos() {
        return await db.query('SELECT * FROM categorias');
    }
    // Filtrar categorías por nombre
    async buscarPorNombre(texto) {
        return await db.query('SELECT * FROM categorias WHERE nombre LIKE ?', [`%${texto}%`]);
    }
    //Unidades vendidas por categoría
    async obtenerEstadisticas() {
        return await db.query(`
            SELECT c.id_categoria, c.nombre,
                   COALESCE(SUM(d.cantidad), 0) AS unidades_vendidas
            FROM categorias c
            LEFT JOIN productos pr ON pr.id_categoria = c.id_categoria
            LEFT JOIN detalles_pedidos d ON d.id_producto = pr.id_producto
            GROUP BY c.id_categoria, c.nombre
        `);
    }
    async crear({ nombre, descripcion }) {
        return await db.query(`INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)`, [nombre, descripcion]);
    }
    async obtenerPorId(id) {
        return await db.query('SELECT * FROM categorias WHERE id_categoria = ?', [id]);
    }
    async actualizar(id, { nombre, descripcion }) {
        return await db.query(`UPDATE categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?`, [nombre, descripcion, id]);
    }
    async eliminar(id) {
        return await db.query('DELETE FROM categorias WHERE id_categoria = ?', [id]);
    }
    async actualizarParcial(id, campos) {
        const permitidos = ['nombre', 'descripcion'];
        const keys = Object.keys(campos).filter(key => permitidos.includes(key));
        if (keys.length === 0) {
            const error = new Error('No se proporcionaron campos válidos para actualizar');
            error.status = 400;
            throw error;
        }
        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const values = keys.map(key => campos[key]);
        values.push(id);
        return await db.query(`UPDATE categorias SET ${setClause} WHERE id_categoria = ?`, values);
    }
}
export default new CategoriasModel();
//# sourceMappingURL=categoriasModels.js.map