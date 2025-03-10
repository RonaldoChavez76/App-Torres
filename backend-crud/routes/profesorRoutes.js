const express = require('express');
const router = express.Router();
const profesorController = require('../controllers/profesorController');

// Cargar actividades disponibles del profesor
router.get('/actividades/:nombreProfesor', profesorController.cargarActividades);

// Buscar estudiante por matrícula o nombre
router.get('/buscar-estudiante/:filtro', profesorController.buscarEstudiante);

// Registrar una actividad extracurricular para un alumno
router.post('/registrar-actividad', profesorController.registrarActividad);

module.exports = router;
