const Estudiante = require('../models/Estudiante');
const Carrera = require('../models/Carrera'); // Importamos el modelo de carreras
const ActividadAsignada = require('../models/ActividadAsignada'); // Importamos el modelo de actividades asignadas

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

  // Lista de campos que no pueden ser modificados
const camposRestringidos = [
  'matriculaEstudiante', 
  'fechaAlta', 
  'fechaNacimiento', 
  'sexo', 
  'rfc', 
  'promedioBachillerato', 
  'especialidadBachillerato', 
  'carrera', 
  'especialidadCursar', 
  'certificadoBachillerato'
];

// Actualizar información personal del alumno
exports.actualizarInformacionPersonal = async (req, res) => {
  try {
    const matricula = req.params.matricula;
    let updatedData = { ...req.body }; // Copiamos los datos para evitar modificar req.body

    // Depurar los datos que llegan para revisar la solicitud
    console.log('Datos a actualizar (antes de filtrar):', updatedData);

    // Bloqueamos la actualización de campos restringidos
    for (let campo of camposRestringidos) {
      if (updatedData.hasOwnProperty(campo)) {
        console.log(`Intento de modificar campo restringido: ${campo}`);
        return res.status(400).json({ error: `El campo '${campo}' no puede ser modificado.` });
      }
    }

    // Eliminar los campos restringidos en caso de que estén en la solicitud
    camposRestringidos.forEach(campo => delete updatedData[campo]);

    // Depurar después de eliminar los campos restringidos
    console.log('Datos a actualizar (después de filtrar):', updatedData);

    // Si pasamos la validación, actualizamos los datos del estudiante
    const estudiante = await Estudiante.findOneAndUpdate(
      { matriculaEstudiante: matricula },
      updatedData,
      { new: true }
    );

    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    // Si se actualizó correctamente, se devuelve el alumno actualizado
    res.status(200).json(estudiante);
  } catch (error) {
    res.status(500).json({ error: error.message });  // Error al actualizar el estudiante
  }
};

  //Funcion para que el alumno pueda consultar los cursos a los que es inscrito 
  // Consultar cursos asignados a un alumno
exports.consultarCursos = async (req, res) => {
  try {
    const matricula = req.params.matricula;
    
    // Buscar al estudiante por su matrícula
    const estudiante = await Estudiante.findOne(
      { matriculaEstudiante: matricula },
      { cursosInscritos: 1, _id: 0 } // Solo devolveremos los cursos, sin otros datos
    );

    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    // Si el estudiante no tiene cursos asignados, enviar una respuesta adecuada
    if (!estudiante.cursosInscritos || estudiante.cursosInscritos.length === 0) {
      return res.status(200).json({ mensaje: 'El alumno no tiene cursos asignados.' });
    }

    res.status(200).json(estudiante.cursosInscritos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Consultar todas las materias según la carrera y especialidad del alumno
exports.consultarMaterias = async (req, res) => {
  try {
    const matricula = req.params.matricula;

    // Buscar al estudiante por su matrícula y obtener su carrera y especialidad
    const estudiante = await Estudiante.findOne(
      { matriculaEstudiante: matricula },
      { carrera: 1, especialidadCursar: 1, _id: 0 }
    );

    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    // Buscar la carrera en la colección "carreras"
    const carrera = await Carrera.findOne(
      { nombreCarrera: estudiante.carrera },
      { especialidades: 1, _id: 0 }
    );

    if (!carrera) {
      return res.status(404).json({ error: 'Carrera no encontrada en el catálogo.' });
    }

    // Buscar la especialidad dentro de la carrera
    const especialidad = carrera.especialidades.find(
      esp => esp.nombreEspecialidad === estudiante.especialidadCursar
    );

    if (!especialidad) {
      return res.status(404).json({ error: 'Especialidad no encontrada en la carrera.' });
    }

    // Obtener la lista de materias de la especialidad
    const materias = especialidad.materias?.map(m => m.nombreMateria) || [];

    if (materias.length === 0) {
      return res.status(200).json({ mensaje: 'No hay materias registradas para esta especialidad.' });
    }

    res.status(200).json(materias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.consultarActividades = async (req, res) => {
  try {
    const matricula = req.params.matricula.toString().trim(); // Convertimos la matrícula a String

    console.log(`🔍 Buscando actividades para matrícula: "${matricula}"`);

    // Buscar en la colección actividadesAsignadas
    const actividadesEstudiante = await ActividadAsignada.findOne(
      { matriculaEstudiante: matricula },
      { actividades: 1, _id: 0 }
    );

    console.log("📊 Resultado de la búsqueda en MongoDB:", actividadesEstudiante);

    if (!actividadesEstudiante || !actividadesEstudiante.actividades || actividadesEstudiante.actividades.length === 0) {
      console.log(`⚠️ No se encontraron actividades para el estudiante ${matricula}`);
      return res.status(404).json({ error: 'No hay actividades asignadas para este estudiante.' });
    }

    res.status(200).json(actividadesEstudiante.actividades);
    
  } catch (error) {
    console.error("❌ Error en la consulta:", error);
    res.status(500).json({ error: 'Ocurrió un error al consultar las actividades.' });
  }
};



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
