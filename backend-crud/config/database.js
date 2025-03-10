const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/miCrudDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Conectado a MongoDB');

    // Manejo de eventos de conexión
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ Se perdió la conexión a MongoDB, intentando reconectar...');
      setTimeout(connectDB, 5000); // Reintento tras 5 segundos
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Error en la conexión a MongoDB:', err);
      process.exit(1);
    });

  } catch (err) {
    console.error('❌ No se pudo conectar a MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
