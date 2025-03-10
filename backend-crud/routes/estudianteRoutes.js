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




module.exports = router;
