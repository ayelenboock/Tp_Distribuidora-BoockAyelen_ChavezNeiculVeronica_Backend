declare class PedidosModel {
    obtenerTodos(): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    crear({ id_cliente, id_empleado, id_compania, total, estado }: {
        id_cliente: any;
        id_empleado: any;
        id_compania: any;
        total?: number | undefined;
        estado?: string | undefined;
    }): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    obtenerPorEstado(estado: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    obtenerEstadisticas(): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    obtenerPorId(id: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    obtenerDetalle(id: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    actualizar(id: any, { id_cliente, id_empleado, id_compania, total, estado }: {
        id_cliente: any;
        id_empleado: any;
        id_compania: any;
        total: any;
        estado: any;
    }): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    eliminar(id: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    actualizarParcial(id: any, campos: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
}
declare const _default: PedidosModel;
export default _default;
//# sourceMappingURL=pedidosModels.d.ts.map