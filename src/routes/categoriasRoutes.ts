import express from "express";
import categoriasControllers from "../controllers/categoriasControllers.js";
import validarId from "../middlewares/validarId.js";


const router = express.Router();

//Métodos GET
router.get('/', categoriasControllers.consultar)
//Método POST
router.post('/', categoriasControllers.ingresar) 

//GET categorías por nombre
router.get('/buscar/:texto', categoriasControllers.buscar)
//GET estadísticas
router.get('/estadisticas', categoriasControllers.estadisticas)

//Métodos con /:id 
router.route('/:id')
 .all(validarId)   // valida el id para PUT, GET, PATCH y DELETE
 .put(categoriasControllers.actualizar)  //Método  PUT

//Método Get id
 .get(categoriasControllers.consultarDetalle)

//Método PATCH
 .patch(categoriasControllers.actualizarParcial )

//Método DELETE
 .delete(categoriasControllers.eliminar)

export default router;