const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/verificarToken");
const {
  listar,
  obtenerPorId,
  crear,
  actualizarEstado,
  eliminar,
} = require("../controllers/incidenteController");

router.get("/", verificarToken, listar);
router.get("/:id", verificarToken, obtenerPorId);
router.post("/", verificarToken, crear);
router.put("/:id/estado", verificarToken, actualizarEstado);
router.delete("/:id", verificarToken, eliminar);

module.exports = router;
