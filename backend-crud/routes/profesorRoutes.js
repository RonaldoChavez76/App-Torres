const express = require('express');
const router = express.Router();
const profesorController = require('../controllers/profesorController');

// Cargar actividades disponibles del profesor
router.get('/actividades/:nombreProfesor', profesorController.cargarActividades);

// Buscar estudiante por matrícula o nombre
router.get('/buscar-estudiante/:filtro', profesorController.buscarEstudiante);

// Registrar una actividad extracurricular para un alumno
router.post('/registrar-actividad', profesorController.registrarActividad);

// Rutas para los profesores
router.get('/todos', profesorController.obtenerProfesores); 

// Ruta para actualizar el estatus de una actividad
router.put('/actualizar-estatus', profesorController.actualizarEstatus); // Esta ruta debería estar bien definida



module.exports = router;
