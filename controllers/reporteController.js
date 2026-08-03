const Reporte = require('../models/Reporte');

exports.crear = async (req, res) => {
  try {
    const { tipo, ubicacion, descripcion, lat, lng } = req.body;

    if (!tipo) return res.status(400).json({ error: 'Debe seleccionar el tipo de incidente.' });
    if (!ubicacion || ubicacion.length < 5)
      return res.status(400).json({ error: 'La ubicación debe tener al menos 5 caracteres.' });
    if (!descripcion || descripcion.length < 10)
      return res.status(400).json({ error: 'La descripción debe tener al menos 10 caracteres.' });

    const reporte = await Reporte.crear({ idUsuario: req.usuario.id, tipo, ubicacion, descripcion, lat, lng });
    res.status(201).json(reporte);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listar = async (req, res) => {
  const reportes = await Reporte.listarPorUsuario(req.usuario.id);
  res.json(reportes);
};

exports.actualizar = async (req, res) => {
  try {
    const { tipo, ubicacion, descripcion, lat, lng } = req.body;
    if (!ubicacion || ubicacion.length < 5)
      return res.status(400).json({ error: 'La ubicación debe tener al menos 5 caracteres.' });
    if (!descripcion || descripcion.length < 10)
      return res.status(400).json({ error: 'La descripción debe tener al menos 10 caracteres.' });

    const reporte = await Reporte.actualizar(req.params.id, { tipo, ubicacion, descripcion, lat, lng });
    res.json(reporte);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cambiarEstado = async (req, res) => {
  const reporte = await Reporte.cambiarEstado(req.params.id, req.body.estado);
  res.json(reporte);
};

exports.eliminar = async (req, res) => {
  try {
    await Reporte.eliminar(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
