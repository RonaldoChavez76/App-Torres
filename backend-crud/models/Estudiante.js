const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema({
  matriculaEstudiante: String,
  nombreCompleto: String,
  fechaAlta: Date,
  fechaNacimiento: Date,
  sexo: String,
  telefonos: [String],
  correos: [String],
  rfc: String,
  domicilio: {
    calle: String,
    numeroInterior: String,
    numeroExterior: String,
    colonia: String,
    codigoPostal: String,
    ciudad: String
  },
  promedioBachillerato: Number,
  especialidadBachillerato: String,
  foto: String,
  tutores: [{
    nombreCompleto: String,
    telefonos: [String],
    correos: [String]
  }],
  carrera: String,
  especialidadCursar: String,
  certificadoBachillerato: Number,

  //Agregamos el campo de cursos inscritos
  cursosInscritos: [{
    nombreCurso: String,
    codigoCurso: String,
    profesor: String,
    horario: String
  }]
});

const Estudiante = mongoose.model('Estudiante', estudianteSchema);
module.exports = Estudiante;
