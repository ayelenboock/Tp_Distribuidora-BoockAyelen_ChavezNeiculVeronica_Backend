declare class ClientesModel {
    obtenerTodos(): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    crear({ nombre, apellido, cuit, razon_social, direccion, telefono, email, dni, condicion_iva }: {
        nombre: any;
        apellido: any;
        cuit: any;
        razon_social: any;
        direccion: any;
        telefono: any;
        email: any;
        dni: any;
        condicion_iva: any;
    }): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    obtenerPorCondicion(condicion: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    obtenerEstadisticas(): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    obtenerPorId(id: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    actualizar(id: any, { nombre, apellido, cuit, razon_social, direccion, telefono, email, dni, condicion_iva }: {
        nombre: any;
        apellido: any;
        cuit: any;
        razon_social: any;
        direccion: any;
        telefono: any;
        email: any;
        dni: any;
        condicion_iva: any;
    }): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    eliminar(id: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    actualizarParcial(id: any, campos: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
}
declare const _default: ClientesModel;
export default _default;
//# sourceMappingURL=clientesModels.d.ts.map