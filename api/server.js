require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const incidenteRoutes = require("./routes/incidenteRoutes");
const { manejadorErrores, rutaNoEncontrada } = require("./middlewares/manejoErrores");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API de Seguridad Neiva funcionando correctamente." });
});

app.use("/api/auth", authRoutes);
app.use("/api/incidentes", incidenteRoutes);

app.use(rutaNoEncontrada);
app.use(manejadorErrores);

app.listen(PORT, () => {
  console.log(`API de Seguridad Neiva escuchando en http://localhost:${PORT}`);
});
