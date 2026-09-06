const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

exports.registrar = async (req, res) => {
  try {
    const { nombre, apellido, cedula, fecha, correo, clave } = req.body;

    if (!nombre || !apellido || !cedula || !fecha || !correo || !clave) {
      return res.status(400).json({ error: 'Debe completar toda la información.' });
    }
    if (clave.length < 4) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres.' });
    }

    const hash = await bcrypt.hash(clave, 10);
    const usuario = await Usuario.crear({ nombre, apellido, cedula, correo, contrasena: hash, fecha });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.iniciarSesion = async (req, res) => {
  try {
    const { correo, clave } = req.body;
    if (!correo || !clave) {
      return res.status(400).json({ error: 'Complete todos los campos.' });
    }

    const usuario = await Usuario.buscarPorCorreo(correo);
    if (!usuario) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos, o el usuario no está registrado.' });
    }

    const valida = await bcrypt.compare(clave, usuario.contrasena);
    if (!valida) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos, o el usuario no está registrado.' });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: `${usuario.nombre} ${usuario.apellido}`,
        cedula: usuario.cedula,
        correo: usuario.correo,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.perfil = async (req, res) => {
  const usuario = await Usuario.buscarPorId(req.usuario.id);
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado.' });
  res.json(usuario);
};
