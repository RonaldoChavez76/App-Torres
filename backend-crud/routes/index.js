const express = require('express');
const router = express.Router();

const estudianteRoutes = require('./estudianteRoutes');
const observacionRoutes = require('./observacionRoutes');
const profesorRoutes = require('./profesorRoutes')
const serviciosRoutes = require('./serviciosEscolaresRoutes')

router.use('/estudiantes', estudianteRoutes);
router.use('/observaciones', observacionRoutes);
// Rutas de profesores de actividades extracurriculares
router.use('/api/profesores', profesorRoutes);
router.use('/servicios-escolares', serviciosRoutes);

module.exports = router;