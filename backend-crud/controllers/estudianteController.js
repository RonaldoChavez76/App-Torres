const Estudiante = require('../models/Estudiante');
const Carrera = require('../models/Carrera'); // Importamos el modelo de carreras
const ActividadAsignada = require('../models/ActividadAsignada'); // Importamos el modelo de actividades asignadas

// Registrar un nuevo estudiante
exports.registrarEstudiante = async (req, res) => {
  try {
    const estudiante = new Estudiante(req.body);
    await estudiante.save();
    res.status(201).send(estudiante);  // Se devuelve el estudiante recién creado
  } catch (error) {
    res.status(400).send(error);  // Error al guardar el estudiante
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


