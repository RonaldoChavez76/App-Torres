const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs.txt');

const logMiddleware = (req, res, next) => {
  const logEntry = `${new Date().toISOString()} - ${req.method} ${req.originalUrl}\n`;
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) console.error('Error al escribir en logs:', err);
  });
  next();
};

module.exports = logMiddleware;
