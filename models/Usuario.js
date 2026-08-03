const db = require('../database/conexion');

class Usuario {
  static async crear({ nombre, apellido, cedula, correo, contrasena, fecha }) {
    const [existe] = await db.mysql.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (existe.length > 0) {
      throw new Error('Ya existe una cuenta registrada con ese correo.');
    }

    const [resultado] = await db.mysql.query(
      `INSERT INTO usuarios (nombre, apellido, cedula, correo, contrasena, fecha_nacimiento)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, cedula, correo, contrasena, fecha || null]
    );
    return { id: resultado.insertId, nombre, apellido, cedula, correo };
  }

  static async buscarPorCorreo(correo) {
    const [filas] = await db.mysql.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return filas[0];
  }

  static async buscarPorId(id) {
    const [filas] = await db.mysql.query(
      'SELECT id, nombre, apellido, cedula, correo FROM usuarios WHERE id = ?',
      [id]
    );
    return filas[0];
  }
}

module.exports = Usuario;
