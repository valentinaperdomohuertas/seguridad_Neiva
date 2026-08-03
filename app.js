require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/reportes', require('./routes/reportes'));
app.use('/api/chat', require('./routes/chat'));

const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => console.log(`Servidor activo en el puerto ${PUERTO}`));
