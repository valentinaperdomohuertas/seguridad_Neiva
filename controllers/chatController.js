const Mensaje = require('../models/Mensaje');

exports.enviarMensaje = async (req, res) => {
  const { contenido } = req.body;
  if (!contenido || !contenido.trim()) {
    return res.status(400).json({ error: 'El mensaje no puede estar vacío.' });
  }

  const mensajeUsuario = await Mensaje.create({
    idUsuario: req.usuario.id,
    emisor: 'Usuario',
    contenido,
  });

  // Respuesta automática de soporte (simulada), ya persistida en MongoDB
  const respuesta = await Mensaje.create({
    idUsuario: req.usuario.id,
    emisor: 'Soporte',
    contenido: 'Hemos recibido tu mensaje, en breve te atenderemos.',
  });

  res.status(201).json([mensajeUsuario, respuesta]);
};

exports.obtenerConversacion = async (req, res) => {
  const mensajes = await Mensaje.find({ idUsuario: req.usuario.id }).sort('fecha');
  res.json(mensajes);
};
