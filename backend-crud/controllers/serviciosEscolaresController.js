//Controladores para servicios escolares
const Estudiante = require('../models/Estudiante');
const Carrera = require('../models/Carrera');
const path = require('path');


// serviciosEscolaresController.js (añadir al inicio del archivo)
function unflatten(obj) {
  const result = {};
  for (const key of Object.keys(obj)) {
    const keys = key.replace(/\]/g, '').split(/\[/);
    let current = result;
    for (let i = 0; i < keys.length; i++) {
      const part = keys[i];
      const isArray = !isNaN(keys[i + 1]);
      if (i === keys.length - 1) {
        current[part] = obj[key];
      } else {
        current[part] = current[part] || (isArray ? [] : {});
        current = current[part];
      }
    }
  }
  return result;
}

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

// Consultar información personal del alumno
exports.consultarInformacionPersonal = async (req, res) => {
  try {
    const matricula = req.params.matricula;
    const estudiante = await Estudiante.findOne({ matriculaEstudiante: matricula });
    if (!estudiante) {
      return res.status(404).send('Estudiante no encontrado');
    }
    res.status(200).send(estudiante);  // Devolvemos los datos del alumno
  } catch (error) {
    res.status(400).send(error);  // Error al buscar el estudiante
  }
};



exports.updateEstudiante = async (req, res) => {
  try {
    const matricula = req.params.matricula;  // Obtener la matrícula desde los parámetros de la URL
    let updatedData = { ...req.body };  // Copiar los datos que vienen en la solicitud

    // Eliminar los campos que no deben enviarse
    delete updatedData._id;
    delete updatedData.__v;

    // Parsear campos que llegan como string (porque se enviaron como JSON.stringify en el FormData)
    if (updatedData.domicilio && typeof updatedData.domicilio === 'string') {
      updatedData.domicilio = JSON.parse(updatedData.domicilio);
    }
    if (updatedData.telefonos && typeof updatedData.telefonos === 'string') {
      updatedData.telefonos = JSON.parse(updatedData.telefonos);
    }
    if (updatedData.correos && typeof updatedData.correos === 'string') {
      updatedData.correos = JSON.parse(updatedData.correos);
    }
    if (updatedData.tutores && typeof updatedData.tutores === 'string') {
      updatedData.tutores = JSON.parse(updatedData.tutores);
    }

    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res.status(400).json({ error: "No se proporcionaron datos para actualizar." });
    }

    // Buscar el estudiante por su matrícula
    const estudiante = await Estudiante.findOne({ matriculaEstudiante: matricula });
    if (!estudiante) {
      return res.status(404).json({ error: "Estudiante no encontrado" });
    }

    // Actualizar los datos del estudiante
    const updatedEstudiante = await Estudiante.findOneAndUpdate(
      { matriculaEstudiante: matricula },
      { $set: updatedData },
      { new: true }
    );

    if (!updatedEstudiante) {
      return res.status(404).json({ error: "Estudiante no encontrado" });
    }

    res.status(200).json(updatedEstudiante);
  } catch (error) {
    console.error('Error al actualizar el estudiante:', error);
    res.status(500).json({ error: error.message });
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

//Crear nuevo estudiante
exports.createEstudiante = async (req, res) => {
  try {
    let { 
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

    // Si los campos llegan como strings, se parsean a objetos/arreglos
    if (typeof telefonos === 'string') {
      telefonos = JSON.parse(telefonos);
    }
    if (typeof correos === 'string') {
      correos = JSON.parse(correos);
    }
    if (typeof tutores === 'string') {
      tutores = JSON.parse(tutores);
    }
    if (typeof domicilio === 'string') {
      domicilio = JSON.parse(domicilio);
    }

    // Validar que los campos obligatorios están presentes
    if (!nombreCompleto || !apellidoPaterno || !semestre || !carrera) {
      return res.status(400).json({ 
        error: "Los campos nombreCompleto, apellidoPaterno, semestre y carrera son obligatorios." 
      });
    }

    // Verificar que telefonos, correos y tutores sean arreglos
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
      apellidoPaterno,
      semestre: Number(semestre),  // Convertir a número si es necesario
      matriculaEstudiante,
      nombreCompleto,
      fechaNacimiento,
      sexo,
      telefonos,
      correos,
      rfc,
      domicilio,
      promedioBachillerato: Number(promedioBachillerato),
      especialidadBachillerato,
      foto,  
      tutores,
      carrera,
      especialidadCursar,
      certificadoBachillerato,
      eliminado: false  // Asignación explícita
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

exports.obtenerCarreras = async (req, res) => {
  try {
    const carreras = await Carrera.find({});
    if (!carreras || carreras.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron carreras' });
    }
    res.json({ carreras });
  } catch (error) {
    console.error('Error al obtener carreras:', error);
    res.status(500).json({ mensaje: 'Error al obtener carreras', error });
  }
};



// estudianteController.js
exports.consultarInformacionPersonalAlumno = async (req, res) => {
  const matricula = req.params.matricula;

  try {
    console.log(`Buscando estudiante con matrícula: ${matricula}`);  // Depuración

    const estudiante = await Estudiante.findOne({ matriculaEstudiante: matricula });

    if (!estudiante) {
      return res.status(404).send('Estudiante no encontrado');
    }

    console.log('Estudiante encontrado:', estudiante);  // Depuración
    res.status(200).send(estudiante);  // Devolver los datos del alumno
  } catch (error) {
    console.error('Error al obtener el estudiante:', error);  // Depuración
    res.status(400).send(error);
  }
};
