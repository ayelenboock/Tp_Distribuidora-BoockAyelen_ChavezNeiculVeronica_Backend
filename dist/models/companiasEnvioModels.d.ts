declare class CompaniasEnvioModel {
    obtenerTodos(): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    buscarPorNombre(texto: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    obtenerEstadisticas(): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    crear({ nombre, telefono, direccion }: {
        nombre: any;
        telefono: any;
        direccion: any;
    }): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    obtenerPorId(id: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    actualizar(id: any, { nombre, telefono, direccion }: {
        nombre: any;
        telefono: any;
        direccion: any;
    }): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    eliminar(id: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    actualizarParcial(id: any, campos: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
}
declare const _default: CompaniasEnvioModel;
export default _default;
//# sourceMappingURL=companiasEnvioModels.d.ts.map