/* const fs = require('fs');
const path = require('path');
const connection = require('./db.js');

// Leer el archivo SQL
const sqlPath = path.join(__dirname, '../db_library.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

// Ejecutar el script SQL
connection.query(sql, function (error, results) {
  if (error) {
    console.error('Error al ejecutar el script SQL:', error);
  } else {
    console.log('Tablas creadas o ya existen.');
  }
  connection.end();
}); */