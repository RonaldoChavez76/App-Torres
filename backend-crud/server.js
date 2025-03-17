const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');  // Importar el módulo path

const connectDB = require('./config/database');

const errorHandler = require('./middleware/errorHandler');
const logMiddleware = require('./middleware/logMiddleware');
const routes = require('./routes/index');

const app = express();
app.use(express.json()); //para poder recibir datos en formato JSON

// Servir la carpeta 'uploads' de forma estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Conexión a MongoDB
connectDB();

app.use('/api', routes);

// Middleware de manejo de errores
app.use(errorHandler);

// Arranque del servidor
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));

app.use(logMiddleware);
