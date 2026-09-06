// API REST del módulo de incidentes - Seguridad Neiva
// Expone los endpoints que consume el frontend en React.
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

// GET /api/incidentes -> lista todos los incidentes
app.get("/api/incidentes", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM incidente ORDER BY fecha_reporte DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al consultar los incidentes." });
  }
});

// GET /api/incidentes/:id -> consulta un incidente puntual
app.get("/api/incidentes/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM incidente WHERE id_incidente = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Incidente no encontrado." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al consultar el incidente." });
  }
});

// POST /api/incidentes -> registra un nuevo incidente
app.post("/api/incidentes", async (req, res) => {
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
});

// PUT /api/incidentes/:id/estado -> actualiza el estado de un incidente
app.put("/api/incidentes/:id/estado", async (req, res) => {
  const { estado } = req.body;
  const estadosValidos = ["PENDIENTE", "EN_PROCESO", "ATENDIDO", "CERRADO"];

  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ mensaje: "Estado no válido." });
  }

  try {
    const [resultado] = await pool.query(
      "UPDATE incidente SET estado = ? WHERE id_incidente = ?",
      [estado, req.params.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Incidente no encontrado." });
    }
    res.json({ mensaje: "Estado actualizado." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar el estado." });
  }
});

// DELETE /api/incidentes/:id -> elimina un incidente
app.delete("/api/incidentes/:id", async (req, res) => {
  try {
    const [resultado] = await pool.query(
      "DELETE FROM incidente WHERE id_incidente = ?",
      [req.params.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Incidente no encontrado." });
    }
    res.json({ mensaje: "Incidente eliminado." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar el incidente." });
  }
});

app.listen(PORT, () => {
  console.log(`API de Seguridad Neiva escuchando en http://localhost:${PORT}`);
});
