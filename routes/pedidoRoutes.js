const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.post('/', pedidoController.crearPedido);
router.get('/', pedidoController.obtenerPedidos);
router.get('/:idPedido', pedidoController.obtenerPedidoPorId);
router.put('/:idPedido', pedidoController.actualizarPedido);
router.delete('/:idPedido', pedidoController.eliminarPedido);

module.exports = router;