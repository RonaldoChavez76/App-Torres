const express = require('express');
const router = express.Router();

const estudianteRoutes = require('./estudianteRoutes');
const observacionRoutes = require('./observacionRoutes');

router.use('/estudiantes', estudianteRoutes);
router.use('/observaciones', observacionRoutes);

module.exports = router;
