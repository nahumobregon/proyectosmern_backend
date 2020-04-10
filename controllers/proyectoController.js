const Proyecto = require('../models/Proyecto')
const {validationResult} = require('express-validator')

exports.crearProyecto = async (req,res) =>{
   
    // Revisar si hay errores
    const errores = validationResult(req)
    if (!errores.isEmpty() ){
        return res.status(400).json({errores: errores.array() })
    }

    try {
        // Crear un proyecto nuevo
        const proyecto = new Proyecto(req.body)
     
        // Antes de guardar el proyecto, vamos a guardar el creador del proyecto
        // via jwt
        proyecto.creador=req.usuario.id
        
        //Guardamos el proyecto
        proyecto.save()
        res.json(proyecto)
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

//obtiene los proyects del usuario actual
exports.obtenerProyectos = async (req,res) =>{
    try {
        //console.log(req.usuario)
        const proyectos= await Proyecto.find( {creador: req.usuario.id}).sort({creado: -1})
        res.json({ proyectos})
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

//Actualizar un proyecto
exports.actualizarProyecto = async(req,res) =>{
    // Revisar si hay errores
    const errores = validationResult(req)
    if (!errores.isEmpty() ){
        return res.status(400).json({errores: errores.array() })
    }

    //extraer la informacion del proyecto
    const {nombre} = req.body
    const nuevoProyecto = {}

    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        // revisar el id
        //console.log(req.params.id)
        let proyecto = await Proyecto.findById(req.params.id)

        // si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg:'Proyecto no encontardo'}) 
        }
        //verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'No autorizado para modificar'}) 
        }

        //actualizar
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set : nuevoProyecto}, {new: true})

        res.json({proyecto})

    } catch (error) {
        console.log(error)
        res.status(500).send('error en el servidor')
        
    }

}

//Eimina un proyecto por su id
exports.eliminarProyecto = async (req,res) => {
    try {
        // revisar el id
        //console.log(req.params.id)
        let proyecto = await Proyecto.findById(req.params.id)

        // si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg:'Proyecto no encontardo'}) 
        }
        //verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'No autorizado para eliminar'}) 
        }

        //Eliminar el proyecto
        await Proyecto.findOneAndRemove({_id : req.params.id})
        res.json({msg:'Proyecto Eliminado'})
        
    } catch (error) {
        console.log(error)
        res.status(401).json({msg:'No Autorizado'})
    }
}