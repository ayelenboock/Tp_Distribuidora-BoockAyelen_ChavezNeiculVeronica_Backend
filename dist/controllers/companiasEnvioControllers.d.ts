declare class CompaniasEnvioController {
    constructor();
    consultar(req: any, res: any): Promise<void>;
    buscar(req: any, res: any): Promise<void>;
    estadisticas(req: any, res: any): Promise<void>;
    ingresar(req: any, res: any): Promise<any>;
    consultarDetalle(req: any, res: any): Promise<any>;
    actualizar(req: any, res: any): Promise<any>;
    actualizarParcial(req: any, res: any): Promise<any>;
    eliminar(req: any, res: any): Promise<any>;
}
declare const _default: CompaniasEnvioController;
export default _default;
//# sourceMappingURL=companiasEnvioControllers.d.ts.map