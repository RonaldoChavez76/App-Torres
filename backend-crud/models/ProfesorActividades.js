const mongoose = require('mongoose');

const profesorActividadesSchema = new mongoose.Schema({
  nombreProfesor: String,
  actividadesDisponibles: [
    {
      nombre: String,
      fechaInicio: Date,
      fechaTermino: Date
    }
  ]
}, { collection: "profesoresActividades" }); // 🔹 Forzar el nombre correcto de la colección

const ProfesorActividades = mongoose.model('ProfesorActividades', profesorActividadesSchema);
module.exports = ProfesorActividades;
