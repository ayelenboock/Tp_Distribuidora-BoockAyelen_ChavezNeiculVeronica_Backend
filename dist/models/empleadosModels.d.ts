declare class EmpleadosModel {
    obtenerTodos(): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    obtenerPorPuesto(puesto: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    obtenerEstadisticas(): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    crear({ nombre, apellido, fecha_de_nac, fecha_de_ingreso, dni, cuil, email, puesto }: {
        nombre: any;
        apellido: any;
        fecha_de_nac: any;
        fecha_de_ingreso: any;
        dni: any;
        cuil: any;
        email: any;
        puesto: any;
    }): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    obtenerPorId(id: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    actualizar(id: any, { nombre, apellido, fecha_de_nac, fecha_de_ingreso, dni, cuil, email, puesto }: {
        nombre: any;
        apellido: any;
        fecha_de_nac: any;
        fecha_de_ingreso: any;
        dni: any;
        cuil: any;
        email: any;
        puesto: any;
    }): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    eliminar(id: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
    actualizarParcial(id: any, campos: any): Promise<[import("mysql2").QueryResult, import("mysql2").FieldPacket[]]>;
}
declare const _default: EmpleadosModel;
export default _default;
//# sourceMappingURL=empleadosModels.d.ts.map