const router = require('express').Router();
const controlador = require('../controllers/chatController');
const verificarToken = require('../middlewares/authMiddleware');

router.use(verificarToken);

router.post('/', controlador.enviarMensaje);
router.get('/', controlador.obtenerConversacion);

module.exports = router;
