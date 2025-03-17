const ProfesorActividades = require('../models/ProfesorActividades');
const ActividadAsignada = require('../models/ActividadAsignada'); // Asegúrate de que este modelo apunte a 'actividadesAsignadas'
const Estudiante = require('../models/Estudiante');

// Registrar actividad extracurricular para un alumno
exports.registrarActividad = async (req, res) => {
    try {
        const { nombreProfesor, matriculaEstudiante, nombreActividad, resultado } = req.body;

        console.log(`Verificando profesor: "${nombreProfesor}"`);
        console.log(`Asignando actividad "${nombreActividad}" al estudiante ${matriculaEstudiante}`);

        // Verificar si el profesor existe
        const profesor = await ProfesorActividades.findOne({ nombreProfesor });

        if (!profesor) {
            return res.status(404).json({ error: "El profesor no está registrado." });
        }

        // Verificar que el profesor pueda asignar esa actividad
        const actividadDisponible = profesor.actividadesDisponibles.find(act => act.nombre === nombreActividad);
        if (!actividadDisponible) {
            return res.status(403).json({ error: "El profesor no puede asignar esta actividad." });
        }

        // Verificar que el estudiante existe
        const estudiante = await Estudiante.findOne({ matriculaEstudiante });

        if (!estudiante) {
            return res.status(404).json({ error: "El estudiante no está registrado." });
        }

        // Registrar la actividad
        const nuevaActividad = {
            nombreActividad,
            codigoActividad: `ACT-${Math.floor(Math.random() * 1000)}`,
            profesor: nombreProfesor,
            fechaInicio: actividadDisponible.fechaInicio,
            fechaTermino: actividadDisponible.fechaTermino,
            resultado: resultado || "Pendiente"
        };

        // Ahora insertamos la actividad en la colección actividadesAsignadas
        await ActividadAsignada.updateOne(
            { matriculaEstudiante },
            { $push: { actividades: nuevaActividad } },
            { upsert: true }  // Crea un nuevo documento si no existe para ese estudiante
        );

        res.status(201).json({ mensaje: "Actividad registrada correctamente", actividad: nuevaActividad });
    } catch (error) {
        console.error("Error en el registro de la actividad:", error);
        res.status(500).json({ error: "Error interno al registrar la actividad." });
    }
};

// Cargar actividades disponibles del profesor
exports.cargarActividades = async (req, res) => {
    try {
        const { nombreProfesor } = req.params;

        console.log(`Buscando actividades para el profesor: "${nombreProfesor}"`);

        const profesor = await ProfesorActividades.findOne(
            { nombreProfesor },
            { actividadesDisponibles: 1, _id: 0 }
        );

        console.log("Resultado de la búsqueda en MongoDB:", profesor);

        if (!profesor) {
            return res.status(404).json({ error: "El profesor no está registrado." });
        }

        res.status(200).json(profesor.actividadesDisponibles);
    } catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ error: "Error interno al cargar actividades." });
    }
};

// Buscar estudiante por matrícula o nombre
exports.buscarEstudiante = async (req, res) => {
    try {
        const { filtro } = req.params; // Puede ser matrícula o nombre

        console.log(`🔍 Buscando estudiante con filtro: "${filtro}"`);

        const estudiante = await Estudiante.findOne({
            $or: [
                { matriculaEstudiante: filtro },
                { nombreCompleto: new RegExp(filtro, 'i') }
            ]
        });

        console.log("Resultado de la búsqueda en MongoDB:", estudiante);

        if (!estudiante) {
            return res.status(404).json({ error: "No se encontró el estudiante." });
        }

        res.status(200).json(estudiante);
    } catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ error: "Error interno al buscar estudiante." });
    }
};

// Obtener todos los profesores
exports.obtenerProfesores = async (req, res) => {
    try {
        const profesores = await ProfesorActividades.find({}, { nombreProfesor: 1, _id: 0 });

        if (!profesores || profesores.length === 0) {
            return res.status(404).json({ error: "No se encontraron profesores." });
        }

        res.status(200).json(profesores);
    } catch (error) {
        console.error("Error al obtener los profesores:", error);
        res.status(500).json({ error: "Error interno al obtener los profesores." });
    }
};

exports.actualizarEstatus = async (req, res) => {
    try {
        const { matriculaEstudiante, nombreActividad, estatus } = req.body;

        // Asegurarse de que 'matriculaEstudiante' es un string
        if (typeof matriculaEstudiante !== 'string') {
            return res.status(400).json({ error: 'La matrícula del estudiante debe ser un string' });
        }

        // Encontrar la actividad asignada para ese estudiante
        const actividadEstudiante = await ActividadAsignada.findOne({ matriculaEstudiante });

        if (!actividadEstudiante) {
            return res.status(404).json({ error: 'No se encontraron actividades asignadas para este estudiante.' });
        }

        // Buscar la actividad específica y actualizar el estatus
        const actividadEncontrada = actividadEstudiante.actividades.find(act => act.nombreActividad === nombreActividad);
        
        if (!actividadEncontrada) {
            return res.status(404).json({ error: 'Actividad no asignada a este estudiante.' });
        }

        // Actualizar el estatus
        actividadEncontrada.resultado = estatus;

        // Guardar los cambios en la base de datos
        await actividadEstudiante.save();

        res.status(200).json({ mensaje: 'Estatus actualizado correctamente', actividad: actividadEncontrada });
    } catch (error) {
        console.error("Error al actualizar el estatus:", error);
        res.status(500).json({ error: 'Error al actualizar el estatus de la actividad.' });
    }
};
