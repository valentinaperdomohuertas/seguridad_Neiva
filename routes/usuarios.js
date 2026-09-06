const router = require('express').Router();
const controlador = require('../controllers/usuarioController');
const verificarToken = require('../middlewares/authMiddleware');

router.post('/registro', controlador.registrar);
router.post('/login', controlador.iniciarSesion);
router.get('/perfil', verificarToken, controlador.perfil);

module.exports = router;
