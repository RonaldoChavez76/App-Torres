const mongoose = require('mongoose');

const ObservacionSchema = new mongoose.Schema({
  docente: { type: mongoose.Schema.Types.ObjectId, ref: 'Docente', required: true }, // Relación con la colección Docente
  asignatura: { type: String, required: true }, // Asignatura que enseña el docente
  semestre: { type: Number, enum: [1, 2], required: true }, // Semestre (1 o 2)
  anio: { type: Number, required: true },  // "anio" en lugar de "año"
  descripcion: { type: String, required: true }, // Observación realizada
  matriculaEstudiante: { type: mongoose.Schema.Types.ObjectId, ref: 'Estudiante', required: true }, // Relación con Estudiante
  createdAt: { type: Date, default: Date.now } // Fecha de creación automática
});

// Crear el modelo y exportarlo
module.exports = mongoose.model('Observacion', ObservacionSchema);
