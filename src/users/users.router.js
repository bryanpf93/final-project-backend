import express from 'express'
import { getAllUsersCtrl,
         createUserCtrl,
         getUsertByIdCtrl, 
         updateUserByIdCtrl, 
         deleteUserByIdCtrl, 
         putUserCtrl
         } from './users.controller.js';
import { getUserInfo } from './users.controller.js';

const router = express.Router(); // asi creo un router en una variable

// defino las rutas dentro del router

router.route('/')
    .get(getUserInfo) // obtener todos los estudiantes (R)
    .post(createUserCtrl); // crear un estudiante (C)

router.route('/:id')
    .get(getUsertByIdCtrl) // obtener un estudiante por su ID (R)
    .patch(updateUserByIdCtrl)  // actualizar un estudiante por su ID (U)
    .put(putUserCtrl)    // actualizar un estudiante por su ID (U)
    .delete(deleteUserByIdCtrl); 


export default router; // exporto el router para que se pueda usar en app.js