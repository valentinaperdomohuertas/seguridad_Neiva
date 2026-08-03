const { mongoose } = require('../database/conexion');

const mensajeSchema = new mongoose.Schema({
  idUsuario: { type: Number, required: true },
  emisor: { type: String, enum: ['Usuario', 'Soporte'], required: true },
  contenido: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Mensaje', mensajeSchema);
