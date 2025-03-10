const Observacion = require('../models/RegistroObservacionesDocente');
const Estudiante = require('../models/Estudiante');
const Docente = require('../models/Docente');

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

    const docente = await Docente.findById(docenteId);
    if (!docente) {
      return res.status(404).json({ mensaje: 'Docente no encontrado' });
    }

    if (!docente.materias || docente.materias.length === 0) {
      return res.status(404).json({ mensaje: 'No hay materias registradas para este docente' });
    }

    // Buscar estudiantes inscritos en las materias que imparte el docente
    const estudiantes = await Estudiante.find({
      especialidadCursar: { $in: docente.materias.map(m => m.nombreMateria) }
    });

    if (estudiantes.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron estudiantes en estas materias' });
    }

    res.json({ estudiantes });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener estudiantes', error });
  }
};

/**
 * 3️⃣ Registrar una nueva observación del docente
 */
exports.registrarObservacion = async (req, res) => {
  try {
    const { docenteId, estudianteId, asignatura, semestre, año, descripcion } = req.body;

    // Validaciones
    if (!docenteId || !estudianteId || !asignatura || !semestre || !año || !descripcion) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si el docente existe
    const docente = await Docente.findById(docenteId);
    if (!docente) {
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    // Verificar si el estudiante existe
    const estudiante = await Estudiante.findById(estudianteId);
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    // Validar que el estudiante pertenece a la materia del profesor
    if (!docente.materias.some(m => m.nombreMateria === asignatura)) {
      return res.status(400).json({ error: 'El estudiante no está en la materia del profesor' });
    }

    // Crear y guardar la observación
    const nuevaObservacion = new Observacion({
      docente: docente.nombre,
      asignatura,
      semestre,
      año,
      descripcion,
      matriculaEstudiante: estudiante.matriculaEstudiante
    });

    await nuevaObservacion.save();

    res.status(201).json({ mensaje: 'Registrado exitosamente', observacion: nuevaObservacion });
  } catch (error) {
    console.error('Error al registrar observación:', error);
    res.status(500).json({ error: 'Error al registrar la observación' });
  }
};

/**
 * 3️⃣ Consultar observaciones hechas al estudiante por el profesor
 */
exports.consultarObservaciones = async (req, res) => {
  try {
    const { docenteId, estudianteId } = req.params;

    // Verificar si el docente existe
    const docente = await Docente.findById(docenteId);
    if (!docente) {
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    // Verificar si el estudiante existe
    const estudiante = await Estudiante.findById(estudianteId);
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    // Buscar observaciones hechas por este docente al estudiante
    const observaciones = await Observacion.find({
      docente: docente.nombre,
      matriculaEstudiante: estudiante.matriculaEstudiante
    });

    if (observaciones.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron observaciones para este estudiante por este docente' });
    }

    res.json({ observaciones });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al consultar observaciones', error });
  }
};
