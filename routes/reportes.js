const router = require('express').Router();
const controlador = require('../controllers/reporteController');
const verificarToken = require('../middlewares/authMiddleware');

router.use(verificarToken);

router.post('/', controlador.crear);
router.get('/', controlador.listar);
router.put('/:id', controlador.actualizar);
router.patch('/:id/estado', controlador.cambiarEstado);
router.delete('/:id', controlador.eliminar);

module.exports = router;
