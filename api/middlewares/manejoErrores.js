function manejadorErrores(error, req, res, next) {
  console.error("Error no controlado:", error);
  res.status(500).json({ mensaje: "Ocurrió un error inesperado en el servidor." });
}

function rutaNoEncontrada(req, res) {
  res.status(404).json({ mensaje: `La ruta ${req.originalUrl} no existe.` });
}

module.exports = { manejadorErrores, rutaNoEncontrada };
