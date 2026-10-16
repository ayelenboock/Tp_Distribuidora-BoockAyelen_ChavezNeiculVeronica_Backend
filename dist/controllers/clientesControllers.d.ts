declare class ClientesController {
    constructor();
    consultar(req: any, res: any): Promise<void>;
    consultarPorCondicion(req: any, res: any): Promise<void>;
    estadisticas(req: any, res: any): Promise<void>;
    ingresar(req: any, res: any): Promise<any>;
    consultarDetalle(req: any, res: any): Promise<any>;
    actualizar(req: any, res: any): Promise<any>;
    actualizarParcial(req: any, res: any): Promise<any>;
    eliminar(req: any, res: any): Promise<any>;
}
declare const _default: ClientesController;
export default _default;
//# sourceMappingURL=clientesControllers.d.ts.map