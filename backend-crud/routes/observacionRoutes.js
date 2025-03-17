const express = require('express');
const router = express.Router();
const observacionController = require('../controllers/observacionController');

// Obtener materias del docente
router.get('/materias/:docenteId', observacionController.obtenerMateriasProfesor);

// Obtener estudiantes por materias del docente
router.get('/estudiantes/:docenteId', observacionController.obtenerEstudiantesPorMaterias);

// Registrar una observación
router.post('/registrar', observacionController.registrarObservacion);

// Consultar observaciones hechas al estudiante por el docente
router.get('/consultar/:docenteId/:matriculaEstudiante', observacionController.consultarObservaciones);

// Obtener lista de docentes con filtro opcional por nombre
router.get('/docentes', observacionController.obtenerDocentes);

module.exports = router;
