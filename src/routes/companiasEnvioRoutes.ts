import express from "express";
import companiasEnvioControllers from "../controllers/companiasEnvioControllers.js";
import validarId from "../middlewares/validarId.js";


const router = express.Router();

//Métodos GET
router.get('/', companiasEnvioControllers.consultar)
//Método POST
router.post('/', companiasEnvioControllers.ingresar) 

//GET compañías por nombre
router.get('/buscar/:texto', companiasEnvioControllers.buscar)

//GET estadísticas
router.get('/estadisticas', companiasEnvioControllers.estadisticas)

//Métodos con /:id 
router.route('/:id')
 .all(validarId)
 .put(companiasEnvioControllers.actualizar)  //Método  PUT

//Método Get id
 .get(companiasEnvioControllers.consultarDetalle)

//Método PATCH
 .patch(companiasEnvioControllers.actualizarParcial )

//Método DELETE
 .delete(companiasEnvioControllers.eliminar)

export default router;