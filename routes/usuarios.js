//rutas para crear usuarios
const express = require('express')
const router = express.Router()
const usuarioController = require('../controllers/usuarioController')
const { check} = require('express-validator')

//Crear Usuario
//api/usuarios

router.post('/',
    [
        check('nombre','El nombre debe medir minimo 5 caracteres').isLength(5),
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('email','Agrega un Email valido').isEmail(),
        check('password','El password debe ser minimo de 6 caracteres').isLength({min:6})
    ],
    usuarioController.crearUsuario
)
module.exports = router;