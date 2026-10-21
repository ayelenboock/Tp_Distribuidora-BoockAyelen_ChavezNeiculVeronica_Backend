import express from "express";
import productosControllers from "../controllers/productosControllers.js";
import validarId from "../middlewares/validarId.js";

const router = express.Router();

//Métodos GET
router.get('/',productosControllers.consultar)
//Método POST
router.post('/',productosControllers.ingresar) 

//GET productos por categoría
router.get('/categoria/:id', validarId, productosControllers.consultarPorCategoria)

//GET estadísticas
router.get('/estadisticas', productosControllers.estadisticas)

//Métodos con /:id 
router.route('/:id')
 .all(validarId)
 .put(productosControllers.actualizar)  //Método  PUT

//Método Get id
 .get(productosControllers.consultarDetalle)

//Método PATCH
 .patch(productosControllers.actualizarParcial)

//Método DELETE
 .delete(productosControllers.eliminar)

export default router;