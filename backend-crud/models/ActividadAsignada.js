const mongoose = require('mongoose');

const actividadSchema = new mongoose.Schema({
  nombreActividad: String,
  codigoActividad: String,
  profesor: String,
  fechaInicio: Date,
  fechaTermino: Date,
  resultado: String
});

const actividadAsignadaSchema = new mongoose.Schema({
  matriculaEstudiante: String,
  actividades: [actividadSchema]
});

const ActividadAsignada = mongoose.model('ActividadAsignada', actividadAsignadaSchema);
module.exports = ActividadAsignada;
