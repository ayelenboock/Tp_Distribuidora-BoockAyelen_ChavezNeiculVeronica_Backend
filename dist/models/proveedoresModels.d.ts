declare class ProveedoresModel {
    obtenerTodos(): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    obtenerPorCondicion(condicion: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    obtenerEstadisticas(): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    crear({ razon_social, nombre_contacto, telefono, email, direccion, condicion_iva }: {
        razon_social: any;
        nombre_contacto: any;
        telefono: any;
        email: any;
        direccion: any;
        condicion_iva: any;
    }): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    obtenerPorId(id: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    actualizar(id: any, { razon_social, nombre_contacto, telefono, email, direccion, condicion_iva }: {
        razon_social: any;
        nombre_contacto: any;
        telefono: any;
        email: any;
        direccion: any;
        condicion_iva: any;
    }): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    eliminar(id: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    actualizarParcial(id: any, campos: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
}
declare const _default: ProveedoresModel;
export default _default;
//# sourceMappingURL=proveedoresModels.d.ts.map