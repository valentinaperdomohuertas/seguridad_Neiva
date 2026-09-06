// Configuración de la conexión a la base de datos MySQL (seguridad_neiva)
// Ajusta usuario y contraseña según tu instalación local de MySQL.
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "12345",
  database: "seguridad_neiva",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
