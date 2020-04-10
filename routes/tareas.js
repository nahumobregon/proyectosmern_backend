//rutas para autenticar usuarios
const express = require('express')
const router = express.Router()
const tareaController = require('../controllers/tareaController')
const auth = require('../middleware/auth')
const { check } = require('express-validator')


//Crea Tareas
//api/tareas
router.post('/',
    auth,
    [
        check('nombre','El nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto','El Proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
)

//Obtener todas las tareas
router.get('/',
    auth,
    tareaController.obtenerTareas
)

//Actualizar tarea via ID
router.put('/:id',
    auth,
    tareaController.actualizarTarea
)

//Eliminar un proyecto proyecto via ID
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)


module.exports = router;