const mongoose = require('mongoose');

const ObservacionSchema = new mongoose.Schema({
  docente: { type: String, required: true }, // Nombre del docente
  asignatura: { type: String, required: true }, // Asignatura que enseña
  semestre: { type: String, required: true }, // Semestre en que se registró la observación
  año: { type: Number, required: true }, // Año en que se registró la observación
  descripcion: { type: String, required: true }, // Descripción de la observación
  matriculaEstudiante: { type: String, ref: 'Estudiante', required: true } // Relación con el estudiante
});

module.exports = mongoose.model('Observacion', ObservacionSchema);
