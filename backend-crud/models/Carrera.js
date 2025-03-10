const mongoose = require('mongoose');

const CarreraSchema = new mongoose.Schema({
  nombreCarrera: { type: String },
  especialidades: [{
    nombreEspecialidad: { type: String },
    materias: [{
      nombreMateria: { type: String }
    }]
  }]
});

module.exports = mongoose.model('Carrera', CarreraSchema);
