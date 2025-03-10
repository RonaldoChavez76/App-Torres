const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');

// Registrar un estudiante
router.post('/registro', estudianteController.registrarEstudiante);

// Consultar información personal de un estudiante
router.get('/perfil/:matricula', estudianteController.consultarInformacionPersonal);

// Actualizar información personal de un estudiante
router.put('/perfil/:matricula', estudianteController.actualizarInformacionPersonal);

// Consultar todas las materias según la carrera y especialidad del alumno
router.get('/materias/:matricula', estudianteController.consultarMaterias);

// Consultar todas las actividades asignadas a un estudiante
router.get('/actividades/:matricula', estudianteController.consultarActividades);



const upload = require('../config/multer');

// Ruta para buscar estudiantes por nombre, carrera o matrícula
router.get('/search', estudianteController.searchEstudiantes);

// Ruta para actualizar los datos de un estudiante por ID
router.put('/:id', estudianteController.updateEstudiante);

// Ruta para eliminar un estudiante definitivamente
router.delete('/:id/definitivo', estudianteController.deleteEstudianteDefinitivo);

// Ruta para eliminar un estudiante temporalmente (Soft Delete)
router.delete('/:id', estudianteController.softDeleteEstudiante);

// Ruta para crear un nuevo estudiante con la carga de la foto
router.post('/', upload.single('foto'), estudianteController.createEstudiante);

module.exports = router;
