const express = require("express");
const router = express.Router();
const {
  listar,
  obtenerPorId,
  crear,
  actualizarEstado,
  eliminar,
} = require("../controllers/incidenteController");

router.get("/", listar);
router.get("/:id", obtenerPorId);
router.post("/", crear);
router.put("/:id/estado", actualizarEstado);
router.delete("/:id", eliminar);

module.exports = router;
