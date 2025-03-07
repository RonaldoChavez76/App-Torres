const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const connectDB = require('./config/database');
const productoRoutes = require('./routes/productoRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Conexión a MongoDB
connectDB();

// Rutas
app.use('/api/productos', productoRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

// Arranque del servidor
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
