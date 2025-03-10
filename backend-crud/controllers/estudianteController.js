const Estudiante = require('../models/Estudiante');
const path = require('path');


//Buscar estudiantes por carrera, nombre o matricula
exports.searchEstudiantes = async (req, res) => {
  const { nombre, carrera, matriculaEstudiante } = req.query;

  // Verificar que se proporcione al menos un criterio de búsqueda
  if (!nombre && !carrera && !matriculaEstudiante) {
    return res.status(400).json({ 
      error: 'Debe proporcionar al menos un criterio de búsqueda: nombre, carrera o matrícula.' 
    });
  }

  try {
    // Construir el objeto de filtros dinámicamente
    let filters = {};

    if (nombre) {
      filters.nombreCompleto = { $regex: nombre, $options: 'i' };
    }

    if (carrera) {
      filters.carrera = { $regex: carrera, $options: 'i' };
    }

    if (matriculaEstudiante) {
      filters.matriculaEstudiante = matriculaEstudiante;
    }

    // Buscar estudiantes con los filtros proporcionados
    const estudiantes = await Estudiante.find(filters);

    if (estudiantes.length === 0) {
      return res.status(404).json({ 
        error: 'No se encontraron estudiantes con los criterios proporcionados.',
        criteria: filters 
      });
    }

    res.json(estudiantes);
  } catch (err) {
    // Log de error para facilitar el debug en el servidor
    console.error(`Error al buscar estudiantes con filtros ${JSON.stringify(req.query)}: `, err);
    res.status(500).json({ 
      error: 'Error interno del servidor al buscar estudiantes. Intente de nuevo más tarde.' 
    });
  }
};


// Actualizar los datos de un estudiante por ID
exports.updateEstudiante = async (req, res) => {
  const { id } = req.params; // Obtener el ID desde los parámetros de la URL
  const updatedData = req.body; // Obtener los nuevos datos desde el cuerpo de la solicitud

  try {
    // Buscar al estudiante por su ID y actualizar sus datos
    const updatedEstudiante = await Estudiante.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedEstudiante) {
      return res.status(404).json({ error: "Estudiante no encontrado" });
    }

    res.json(updatedEstudiante); // Retornar el estudiante actualizado
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar definitivamente un estudiante por ID
exports.deleteEstudianteDefinitivo = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEstudiante = await Estudiante.findByIdAndDelete(id);

    if (!deletedEstudiante) {
      return res.status(404).json({ error: "Estudiante no encontrado" });
    }

    res.json({ message: 'Estudiante eliminado definitivamente', deletedEstudiante });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Eliminar temporalmente un estudiante (Soft Delete)
exports.softDeleteEstudiante = async (req, res) => {
  const { id } = req.params;

  try {
    const estudiante = await Estudiante.findById(id);

    if (!estudiante) {
      return res.status(404).json({ error: "Estudiante no encontrado" });
    }

    // Marcar al estudiante como eliminado
    estudiante.eliminado = true;
    await estudiante.save();

    res.json({ message: 'Estudiante eliminado temporalmente', estudiante });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//Funcion para generar matricula
const generarMatricula = async (semestre, apellidoPaterno) => {
  const añoActual = new Date().getFullYear().toString().slice(-2);
  const sufijo = apellidoPaterno.substring(0, 1).toUpperCase(); // Solo la primera letra
  let consecutivo = 1;

  // Obtener el último estudiante registrado en el mismo semestre y año
  const ultimoEstudiante = await Estudiante.findOne({ semestre })
    .sort({ matriculaEstudiante: -1 })
    .select('matriculaEstudiante');

  if (ultimoEstudiante) {
    const lastNum = parseInt(ultimoEstudiante.matriculaEstudiante.slice(-4));
    consecutivo = lastNum + 1;
  }

  return `${añoActual}${semestre}${sufijo}${consecutivo.toString().padStart(4, '0')}`;
};


// Crear un nuevo estudiante
exports.createEstudiante = async (req, res) => {
  try {
    // Desestructurar los datos del cuerpo de la solicitud
    const { 
      semestre, 
      apellidoPaterno,
      nombreCompleto, 
      fechaNacimiento, 
      sexo, 
      telefonos = [], 
      correos = [], 
      rfc, 
      domicilio, 
      promedioBachillerato, 
      especialidadBachillerato, 
      tutores = [], 
      carrera, 
      especialidadCursar, 
      certificadoBachillerato 
    } = req.body;

    // Validar que los campos obligatorios están presentes
    if (!nombreCompleto || !apellidoPaterno || !semestre || !carrera) {
      return res.status(400).json({ 
        error: "Los campos nombreCompleto, apellidoPaterno, semestre y carrera son obligatorios." 
      });
    }

    // Verificar que telefonos y correos sean arrays
    if (!Array.isArray(telefonos) || !Array.isArray(correos) || !Array.isArray(tutores)) {
      return res.status(400).json({ 
        error: "Los campos telefonos, correos y tutores deben ser arreglos." 
      });
    }

    // Generar la matrícula automáticamente
    const matriculaEstudiante = await generarMatricula(semestre, apellidoPaterno);
    if (!matriculaEstudiante) {
      return res.status(500).json({ error: "Error al generar la matrícula." });
    }

    // Si se carga una foto, obtener la ruta de la imagen
    const foto = req.file ? req.file.path : ''; 

    // Crear el nuevo estudiante
    const nuevoEstudiante = new Estudiante({
      matriculaEstudiante,
      nombreCompleto,
      fechaNacimiento,
      sexo,
      telefonos,
      correos,
      rfc,
      domicilio,
      promedioBachillerato,
      especialidadBachillerato,
      foto,  
      tutores,
      carrera,
      especialidadCursar,
      certificadoBachillerato
    });

    // Guardar el estudiante en la base de datos
    const savedEstudiante = await nuevoEstudiante.save();

    res.status(201).json({ 
      mensaje: "Estudiante registrado exitosamente", 
      estudiante: savedEstudiante 
    });

  } catch (err) {
    console.error("Error al crear estudiante:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
