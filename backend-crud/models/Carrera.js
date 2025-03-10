const mongoose = require('mongoose');

const carreraSchema = new mongoose.Schema({
  nombreCarrera: String,
  especialidades: [
    {
      nombreEspecialidad: String,
      materias: [{ nombreMateria: String }]
    }
  ]
});

const Carrera = mongoose.model('Carrera', carreraSchema);
module.exports = Carrera;
