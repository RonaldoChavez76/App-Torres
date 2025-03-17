const Observacion = require('../models/RegistroObservacionesDocente');
const Estudiante = require('../models/Estudiante');
const Docente = require('../models/Docente');
const Carrera = require('../models/Carrera')

/**
 * 1️⃣ Obtener materias del profesor para filtrar estudiantes
 */
exports.obtenerMateriasProfesor = async (req, res) => {
  try {
    const { docenteId } = req.params; // Recibe el ID del docente como parámetro

    const docente = await Docente.findById(docenteId);
    if (!docente) {
      return res.status(404).json({ mensaje: 'Docente no encontrado' });
    }

    if (!docente.materias || docente.materias.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron materias para este docente' });
    }

    res.json({ materias: docente.materias });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener materias', error });
  }
};

/**
 * 2️⃣ Obtener estudiantes inscritos en las materias del profesor
 */
exports.obtenerEstudiantesPorMaterias = async (req, res) => {
  try {
    const { docenteId } = req.params;

    // Buscar el docente en la base de datos
    const docente = await Docente.findById(docenteId);
    if (!docente) {
      return res.status(404).json({ mensaje: 'Docente no encontrado' });
    }

    if (!docente.materias || docente.materias.length === 0) {
      return res.status(404).json({ mensaje: 'No hay materias registradas para este docente' });
    }

    // Obtener las materias que imparte el docente
    const materiasDocente = docente.materias.map(m => m.nombreMateria);

    // Buscar las especialidades que incluyen esas materias
    const carreras = await Carrera.find({ "especialidades.materias.nombreMateria": { $in: materiasDocente } });

    if (!carreras.length) {
      return res.status(404).json({ mensaje: 'No se encontraron especialidades con estas materias' });
    }

    // Extraer las especialidades que contienen esas materias
    const especialidadesRelacionadas = [];
    carreras.forEach(carrera => {
      carrera.especialidades.forEach(especialidad => {
        if (especialidad.materias.some(m => materiasDocente.includes(m.nombreMateria))) {
          especialidadesRelacionadas.push(especialidad.nombreEspecialidad);
        }
      });
    });

    if (!especialidadesRelacionadas.length) {
      return res.status(404).json({ mensaje: 'No se encontraron especialidades relacionadas con estas materias' });
    }

    // Buscar estudiantes que cursan esas especialidades
    const estudiantes = await Estudiante.find({ especialidadCursar: { $in: especialidadesRelacionadas } });

    if (!estudiantes.length) {
      return res.status(404).json({ mensaje: 'No se encontraron estudiantes inscritos en estas materias' });
    }

    res.json({ estudiantes });
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({ mensaje: 'Error al obtener estudiantes', error });
  }
};


exports.registrarObservacion = async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body); // 👀 Verificar qué datos llegan desde Postman

    // ❌ ERROR: const { docenteId, matriculaEstudiante, asignatura, semestre, año, descripcion } = req.body;
    // ✅ CORRECTO:
    const { docenteId, matriculaEstudiante, asignatura, semestre, anio, descripcion } = req.body;

    // Validaciones
    if (!docenteId || !matriculaEstudiante || !asignatura || !semestre || !anio || !descripcion) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si el docente existe
    const docente = await Docente.findById(docenteId);
    if (!docente) {
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    // Buscar el estudiante por matrícula
    const estudiante = await Estudiante.findOne({ matriculaEstudiante });
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado con esa matrícula' });
    }

    // Validar que el estudiante pertenece a la materia del profesor
    const estudianteEnMateria = docente.materias.some(m => m.nombreMateria === asignatura);
    if (!estudianteEnMateria) {
      return res.status(400).json({ error: 'El estudiante no está en la materia del profesor' });
    }

    // Crear y guardar la observación con el ID del estudiante
    const nuevaObservacion = new Observacion({
      docente: docente._id,
      asignatura,
      semestre,
      anio,  // Ahora usa "anio"
      descripcion,
      matriculaEstudiante: estudiante._id
    });

    await nuevaObservacion.save();

    res.status(201).json({ mensaje: 'Registrado exitosamente', observacion: nuevaObservacion });
  } catch (error) {
    console.error('Error al registrar observación:', error);
    res.status(500).json({ error: 'Error al registrar la observación' });
  }
};



/**
 * 4 Consultar observaciones hechas al estudiante por el profesor
 */
exports.consultarObservaciones = async (req, res) => {
  try {
    const { docenteId, matriculaEstudiante } = req.params;

    console.log("Parámetros recibidos:", req.params);

    // Verificar si el docente existe
    const docente = await Docente.findById(docenteId);
    if (!docente) {
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    // Verificar si el estudiante existe mediante la matrícula
    const estudiante = await Estudiante.findOne({ matriculaEstudiante });
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado con esa matrícula' });
    }

    // Buscar observaciones hechas por este docente al estudiante
    const observaciones = await Observacion.find({
      docente: docente._id,
      matriculaEstudiante: estudiante._id
    })
    .populate('docente', 'nombre')
    .populate('matriculaEstudiante', 'matriculaEstudiante nombreCompleto')  // Seleccionamos la matrícula y nombre
    .select('asignatura semestre anio descripcion createdAt')  // Si necesitas más campos del modelo Observacion

    if (observaciones.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron observaciones para este estudiante por este docente' });
    }

    res.json({ observaciones });
  } catch (error) {
    console.error('Error al consultar observaciones:', error);
    res.status(500).json({ mensaje: 'Error al consultar observaciones', error });
  }
};

/**
 * 5️⃣ Obtener la lista de docentes con filtro opcional por nombre
 */
exports.obtenerDocentes = async (req, res) => {
  try {
    const { nombre } = req.query; // Parámetro opcional para filtrar por nombre

    let query = {};
    if (nombre) {
      query.nombre = { $regex: nombre, $options: 'i' }; // Búsqueda insensible a mayúsculas y minúsculas
    }

    const docentes = await Docente.find(query).select('_id nombre');

    if (!docentes.length) {
      return res.status(404).json({ mensaje: 'No se encontraron docentes' });
    }

    res.json({ docentes });
  } catch (error) {
    console.error('Error al obtener docentes:', error);
    res.status(500).json({ mensaje: 'Error al obtener docentes', error });
  }
};




