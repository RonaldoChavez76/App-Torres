const express = require('express');
const router = express.Router();
const estudianteServiciosController = require('../controllers/serviciosEscolaresController');
const upload = require('../config/multer');


// Ruta para buscar estudiantes por nombre, carrera o matrícula
router.get('/search', estudianteServiciosController.searchEstudiantes);

// Ruta para actualizar los datos de un estudiante por matrícula, usando multer para parsear el FormData
router.put('/edit/:matricula', upload.single('foto'), estudianteServiciosController.updateEstudiante);



// Ruta para eliminar un estudiante definitivamente
router.delete('/:id/definitivo', estudianteServiciosController.deleteEstudianteDefinitivo);

// Ruta para eliminar un estudiante temporalmente (Soft Delete)
router.delete('/:id', estudianteServiciosController.softDeleteEstudiante);

// Ruta para crear un nuevo estudiante con la carga de la foto
router.post('/', upload.single('foto'), estudianteServiciosController.createEstudiante);

// Ruta para obtener todas las carreras
router.get('/', estudianteServiciosController.obtenerCarreras);

// Informacion del alumno
router.get('/info/:matricula', estudianteServiciosController.consultarInformacionPersonalAlumno);

module.exports = router;