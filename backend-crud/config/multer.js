const multer = require('multer');
const path = require('path');

// Definir dónde se guardarán las fotos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directorio donde se guardarán las fotos
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const filename = Date.now() + extension; // Nombre único para cada archivo
    cb(null, filename);
  }
});

// Filtrar solo imágenes
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'));
  }
};

// Configurar multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limitar el tamaño del archivo a 5MB
});

module.exports = upload;
