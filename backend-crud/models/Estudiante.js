const mongoose = require('mongoose');

const EstudianteSchema = new mongoose.Schema({
  apellidoPaterno:{type: String, required: true},
  semestre: { type:Number, require: true},
  matriculaEstudiante: { type: String, required: true },
  nombreCompleto: { type: String, required: true },
  fechaAlta: { type: Date, default: Date.now },
  fechaNacimiento: { type: Date },
  sexo: { type: String, enum: ['M', 'F'] },
  telefonos: [{ type: String }],
  correos: [{ type: String }],
  rfc: { type: String },
  domicilio: {
    calle: { type: String },
    numeroInterior: { type: String },
    numeroExterior: { type: String },
    colonia: { type: String },
    codigoPostal: { type: String },
    ciudad: { type: String }
  },
  promedioBachillerato: { type: Number },
  especialidadBachillerato: { type: String },
  foto: { type: String },
  tutores: [{
    nombreCompleto: { type: String },
    domicilio: {
      calle: { type: String },
      numeroInterior: { type: String },
      numeroExterior: { type: String },
      colonia: { type: String },
      codigoPostal: { type: String },
      ciudad: { type: String }
    },
    telefonos: [{ type: String }],
    correos: [{ type: String }]
  }],
  carrera: { type: String },
  especialidadCursar: { type: String },
  certificadoBachillerato: { type: Number },
  eliminado: { type: Boolean, default: false }
});

module.exports = mongoose.model('Estudiante', EstudianteSchema);
