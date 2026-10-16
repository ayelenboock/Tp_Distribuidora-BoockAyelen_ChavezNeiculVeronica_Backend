declare class PedidosController {
    constructor();
    consultar(req: any, res: any): Promise<void>;
    ingresar(req: any, res: any): Promise<any>;
    consultarPorEstado(req: any, res: any): Promise<void>;
    estadisticas(req: any, res: any): Promise<void>;
    consultarDetalle(req: any, res: any): Promise<any>;
    actualizar(req: any, res: any): Promise<any>;
    actualizarParcial(req: any, res: any): Promise<any>;
    eliminar(req: any, res: any): Promise<any>;
}
declare const _default: PedidosController;
export default _default;
//# sourceMappingURL=pedidosControllers.d.ts.map