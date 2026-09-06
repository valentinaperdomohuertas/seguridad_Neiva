const db = require('../database/conexion');

class Reporte {
  static async crear({ idUsuario, tipo, ubicacion, descripcion, lat, lng }) {
    const [resultado] = await db.mysql.query(
      `INSERT INTO reportes (id_usuario, tipo, ubicacion, descripcion, estado, lat, lng)
       VALUES (?, ?, ?, ?, 'Pendiente', ?, ?)`,
      [idUsuario, tipo, ubicacion, descripcion, lat || null, lng || null]
    );
    return this.buscarPorId(resultado.insertId);
  }

  static async listarPorUsuario(idUsuario) {
    const [filas] = await db.mysql.query(
      'SELECT * FROM reportes WHERE id_usuario = ? ORDER BY fecha DESC',
      [idUsuario]
    );
    return filas;
  }

  static async buscarPorId(id) {
    const [filas] = await db.mysql.query('SELECT * FROM reportes WHERE id = ?', [id]);
    return filas[0];
  }

  static async actualizar(id, { tipo, ubicacion, descripcion, lat, lng }) {
    await db.mysql.query(
      `UPDATE reportes SET tipo = ?, ubicacion = ?, descripcion = ?, lat = ?, lng = ? WHERE id = ?`,
      [tipo, ubicacion, descripcion, lat || null, lng || null, id]
    );
    return this.buscarPorId(id);
  }

  static async cambiarEstado(id, estado) {
    await db.mysql.query('UPDATE reportes SET estado = ? WHERE id = ?', [estado, id]);
    return this.buscarPorId(id);
  }

  static async eliminar(id) {
    const reporte = await this.buscarPorId(id);
    if (reporte && reporte.estado === 'En proceso') {
      throw new Error("No se puede eliminar un reporte que está 'En proceso'. Cámbialo a Pendiente o Resuelto primero.");
    }
    await db.mysql.query('DELETE FROM reportes WHERE id = ?', [id]);
  }
}

module.exports = Reporte;
