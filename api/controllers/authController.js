const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const SALT_ROUNDS = 10;

function validarCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

async function registrar(req, res) {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ mensaje: "Nombre, correo y contraseña son obligatorios." });
  }
  if (!validarCorreo(correo)) {
    return res.status(400).json({ mensaje: "El correo no tiene un formato válido." });
  }
  if (contrasena.length < 6) {
    return res.status(400).json({ mensaje: "La contraseña debe tener al menos 6 caracteres." });
  }

  try {
    const [existentes] = await pool.query("SELECT id_usuario FROM usuario WHERE correo = ?", [correo]);
    if (existentes.length > 0) {
      return res.status(409).json({ mensaje: "Ya existe un usuario registrado con ese correo." });
    }

    const contrasenaHasheada = await bcrypt.hash(contrasena, SALT_ROUNDS);

    const [resultado] = await pool.query(
      "INSERT INTO usuario (nombre, correo, contrasena, rol) VALUES (?, ?, ?, 'CIUDADANO')",
      [nombre, correo, contrasenaHasheada]
    );

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente.",
      usuario: { id_usuario: resultado.insertId, nombre, correo, rol: "CIUDADANO" },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error interno al registrar el usuario." });
  }
}

async function iniciarSesion(req, res) {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios." });
  }

  try {
    const [filas] = await pool.query("SELECT * FROM usuario WHERE correo = ?", [correo]);
    if (filas.length === 0) {
      return res.status(401).json({ mensaje: "Credenciales inválidas." });
    }

    const usuario = filas[0];
    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!coincide) {
      return res.status(401).json({ mensaje: "Credenciales inválidas." });
    }

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      mensaje: "Inicio de sesión exitoso.",
      token,
      usuario: { id_usuario: usuario.id_usuario, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error interno al iniciar sesión." });
  }
}

module.exports = { registrar, iniciarSesion };
