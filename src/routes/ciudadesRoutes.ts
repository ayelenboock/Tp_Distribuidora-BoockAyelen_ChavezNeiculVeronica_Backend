import express from "express";
import ciudadesControllers from "../controllers/ciudadesControllers.js";


const router = express.Router();

//Métodos GET
router.get('/', ciudadesControllers.consultar)
//Método POST
router.post('/', ciudadesControllers.ingresar) 

//GET categorías por nombre
router.get('/buscar/:texto', ciudadesControllers.buscar)
//GET estadísticas
router.get('/estadisticas', ciudadesControllers.estadisticas)

//Métodos con /:id 
router.route('/:id')
 .put(ciudadesControllers.actualizar)  //Método  PUT

//Método Get id
 .get(ciudadesControllers.consultarDetalle)

//Método PATCH
 .patch(ciudadesControllers.actualizarParcial )

//Método DELETE
 .delete(ciudadesControllers.eliminar)

export default router;