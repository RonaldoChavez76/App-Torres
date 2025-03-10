const ProfesorActividades = require('../models/ProfesorActividades');
const ActividadAsignada = require('../models/ActividadAsignada');
const Estudiante = require('../models/Estudiante');

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

        await ActividadAsignada.updateOne(
            { matriculaEstudiante },
            { $push: { actividades: nuevaActividad } },
            { upsert: true }
        );

        res.status(201).json({ mensaje: "Actividad registrada correctamente", actividad: nuevaActividad });
    } catch (error) {
        console.error("Error en el registro de la actividad:", error);
        res.status(500).json({ error: "Error interno al registrar la actividad." });
    }
};


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
