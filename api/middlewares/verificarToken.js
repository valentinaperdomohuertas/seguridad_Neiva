const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const encabezado = req.headers["authorization"];
  if (!encabezado) {
    return res.status(401).json({ mensaje: "No se proporcionó un token de autenticación." });
  }

  const token = encabezado.split(" ")[1];
  if (!token) {
    return res.status(401).json({ mensaje: "Formato de token inválido." });
  }

  try {
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = datos;
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: "Token inválido o expirado." });
  }
}

module.exports = verificarToken;
