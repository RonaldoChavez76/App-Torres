const mongoose = require('mongoose');

const DocenteSchema = new mongoose.Schema({
  nombre: { type: String },
  materias: [{
    nombreMateria: { type: String }
  }]
});

module.exports = mongoose.model('Docente', DocenteSchema);
