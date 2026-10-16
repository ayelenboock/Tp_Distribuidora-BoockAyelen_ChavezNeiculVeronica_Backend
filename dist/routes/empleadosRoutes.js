import express from "express";
import empleadosControllers from "../controllers/empleadosControllers.js";
const router = express.Router();
//Métodos GET
router.get('/', empleadosControllers.consultar);
//Método POST
router.post('/', empleadosControllers.ingresar);
//GET empleados por puesto
router.get('/puesto/:puesto', empleadosControllers.consultarPorPuesto);
//GET estadísticas
router.get('/estadisticas', empleadosControllers.estadisticas);
//Métodos con /:id 
router.route('/:id')
    .put(empleadosControllers.actualizar) //Método  PUT
    //Método Get id
    .get(empleadosControllers.consultarDetalle)
    //Método PATCH
    .patch(empleadosControllers.actualizarParcial)
    //Método DELETE
    .delete(empleadosControllers.eliminar);
export default router;
//# sourceMappingURL=empleadosRoutes.js.map