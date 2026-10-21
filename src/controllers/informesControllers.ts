import type { Request, Response, NextFunction } from 'express';
import InformesModel from '../models/informesModels.js';

// Valida que un texto tenga formato de fecha AAAA-MM-DD y sea una fecha real
const esFechaValida = (texto: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(texto) && !isNaN(new Date(texto).getTime());

class InformesController {
    constructor () { }

//GET informe de ventas por categoría (SQL puro con $queryRaw)
    async ventasPorCategoria(req:Request, res:Response, next: NextFunction) {
        try {
            // Fechas opcionales por query string: ?desde=2026-01-01&hasta=2026-12-31
            // Si no vienen, se toma todo el historial
            const desde = String(req.query.desde ?? '2000-01-01');
            const hasta = String(req.query.hasta ?? '2999-12-31');

            if (!esFechaValida(desde) || !esFechaValida(hasta)) {
                return res.status(400).json({ error: 'Las fechas deben tener el formato AAAA-MM-DD' });
            }

            if (desde > hasta) {
                return res.status(400).json({ error: 'La fecha "desde" no puede ser posterior a "hasta"' });
            }

            const filas = await InformesModel.ventasPorCategoria(desde, hasta);

            // Convertimos BigInt y Decimal a número para poder enviarlos como JSON
            const categorias = filas.map(fila => ({
                id_categoria: fila.id_categoria,
                categoria: fila.categoria,
                cantidad_pedidos: Number(fila.cantidad_pedidos),
                unidades_vendidas: Number(fila.unidades_vendidas),
                total_facturado: Number(fila.total_facturado)
            }));

            // Totales generales del período
            const total_facturado = categorias.reduce((acumulado, cat) => acumulado + cat.total_facturado, 0);
            const total_unidades = categorias.reduce((acumulado, cat) => acumulado + cat.unidades_vendidas, 0);

            return res.status(200).json({
                informe: 'Ventas por categoría',
                periodo: { desde, hasta },
                total_facturado,
                total_unidades,
                categorias
            });
        }catch(err){
            next(err); // lo maneja el middleware global de errores
        }
    }
}

export default new InformesController();
