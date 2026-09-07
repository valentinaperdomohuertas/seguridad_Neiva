const pool = require("../db");

const ESTADOS_VALIDOS = ["PENDIENTE", "EN_PROCESO", "ATENDIDO", "CERRADO"];

async function listar(req, res) {
  try {
    const [filas] = await pool.query("SELECT * FROM incidente ORDER BY fecha_reporte DESC");
    res.json(filas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al consultar los incidentes." });
  }
}

async function obtenerPorId(req, res) {
  try {
    const [filas] = await pool.query("SELECT * FROM incidente WHERE id_incidente = ?", [req.params.id]);
    if (filas.length === 0) {
      return res.status(404).json({ mensaje: "Incidente no encontrado." });
    }
    res.json(filas[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al consultar el incidente." });
  }
}

async function crear(req, res) {
  const { tipo, descripcion, ubicacion, idUsuario } = req.body;

  if (!tipo || !descripcion || !ubicacion || !idUsuario) {
    return res.status(400).json({
      mensaje: "Los campos tipo, descripcion, ubicacion e idUsuario son obligatorios.",
    });
  }

  try {
    const [resultado] = await pool.query(
      "INSERT INTO incidente (tipo, descripcion, ubicacion, estado, id_usuario) VALUES (?, ?, ?, 'PENDIENTE', ?)",
      [tipo, descripcion, ubicacion, idUsuario]
    );
    res.status(201).json({ id_incidente: resultado.insertId, mensaje: "Incidente registrado." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar el incidente." });
  }
}

async function actualizarEstado(req, res) {
  const { estado } = req.body;

  if (!ESTADOS_VALIDOS.includes(estado)) {
    return res.status(400).json({ mensaje: `Estado no válido. Use uno de: ${ESTADOS_VALIDOS.join(", ")}` });
  }

  try {
    const [resultado] = await pool.query("UPDATE incidente SET estado = ? WHERE id_incidente = ?", [
      estado,
      req.params.id,
    ]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Incidente no encontrado." });
    }
    res.json({ mensaje: "Estado actualizado." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar el estado." });
  }
}

async function eliminar(req, res) {
  try {
    const [resultado] = await pool.query("DELETE FROM incidente WHERE id_incidente = ?", [req.params.id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Incidente no encontrado." });
    }
    res.json({ mensaje: "Incidente eliminado." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar el incidente." });
  }
}

module.exports = { listar, obtenerPorId, crear, actualizarEstado, eliminar };
