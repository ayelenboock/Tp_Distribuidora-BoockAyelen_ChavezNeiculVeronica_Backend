import express from "express";
import informesControllers from "../controllers/informesControllers.js";

const router = express.Router();

//GET informe de ventas por categoría (SQL puro)
//Fechas opcionales: /api/informes/ventas?desde=2026-01-01&hasta=2026-12-31
router.get('/ventas', informesControllers.ventasPorCategoria)

export default router;
