const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.post('/', pedidoController.crearPedido);
router.get('/', pedidoController.obtenerPedidos);
router.get('/:idOrder', pedidoController.obtenerPedidoPorId);
router.put('/:idOrder', pedidoController.actualizarPedido);
router.put('/finalizar/:idOrder',pedidoController.finalizarCompra);
router.delete('/:idOrder', pedidoController.eliminarPedido);

module.exports = router;
