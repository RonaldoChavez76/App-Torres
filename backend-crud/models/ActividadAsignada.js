const mongoose = require('mongoose');

// Esquema para una actividad asignada
const actividadSchema = new mongoose.Schema({
  nombreActividad: String,
  codigoActividad: String,
  profesor: String,
  fechaInicio: Date,
  fechaTermino: Date,
  resultado: String
});

// Esquema principal para las actividades asignadas a un estudiante
const actividadAsignadaSchema = new mongoose.Schema({
  matriculaEstudiante: String,  // La matrícula del estudiante
  actividades: [actividadSchema]  // Lista de actividades asignadas
}, { collection: 'actividadasignadas' });  // Definir la colección "actividadesAsignadas"

// Crear y exportar el modelo de actividades asignadas
const ActividadAsignada = mongoose.model('ActividadAsignada', actividadAsignadaSchema);
module.exports = ActividadAsignada;
