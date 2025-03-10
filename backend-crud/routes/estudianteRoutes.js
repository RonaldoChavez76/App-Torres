const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');
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
