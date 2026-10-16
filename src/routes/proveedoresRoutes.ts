import express from "express";
import ProveedoresController from "../controllers/proveedoresControllers.js";

const router = express.Router();

//Métodos GET
router.get('/', ProveedoresController.consultar)
//Método POST
router.post('/', ProveedoresController.ingresar) 

//GET proveedores por condición de IVA
router.get('/condicion/:condicion', ProveedoresController.consultarPorCondicion)

//GET estadísticas
router.get('/estadisticas', ProveedoresController.estadisticas)

//Métodos con /:id 
router.route('/:id')
 .put(ProveedoresController.actualizar)  //Método  PUT

//Método Get id
 .get(ProveedoresController.consultarDetalle)

//Método PATCH
 .patch(ProveedoresController.actualizarParcial)

//Método DELETE
 .delete(ProveedoresController.eliminar)

export default router;