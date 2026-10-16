declare class ProductosModel {
    obtenerTodos(): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    crear({ id_categoria, id_proveedor, nombre_producto, descripcion, precio, stock }: {
        id_categoria: any;
        id_proveedor: any;
        nombre_producto: any;
        descripcion: any;
        precio: any;
        stock?: number | undefined;
    }): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    obtenerPorCategoria(idCategoria: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    obtenerEstadisticas(): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    obtenerPorId(id: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    actualizar(id: any, { id_categoria, id_proveedor, nombre_producto, descripcion, precio, stock }: {
        id_categoria: any;
        id_proveedor: any;
        nombre_producto: any;
        descripcion: any;
        precio: any;
        stock: any;
    }): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    eliminar(id: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    actualizarParcial(id: any, campos: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
}
declare const _default: ProductosModel;
export default _default;
//# sourceMappingURL=productosModels.d.ts.map