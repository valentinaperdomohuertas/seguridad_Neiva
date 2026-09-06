require('dotenv').config();
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');

const mysqlPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'seguridad_neiva',
  waitForConnections: true,
  connectionLimit: 10,
});

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/seguridad_neiva_chat')
  .then(() => console.log('MongoDB conectado'))
  .catch((error) => console.error('Error de conexión a MongoDB:', error.message));

module.exports = { mysql: mysqlPool, mongoose };
