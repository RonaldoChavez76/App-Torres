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
router.get('/consultar/:docenteId/:estudianteId', observacionController.consultarObservaciones);

module.exports = router;
