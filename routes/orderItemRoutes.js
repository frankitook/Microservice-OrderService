const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/:idOrder', cartController.obtenerCarrito);
router.post('/:idOrder/:idProducto/:cantidad', cartController.agregarProductoAlCarrito);
router.delete('/:idOrder/:idProducto', cartController.eliminarProductoDelCarrito);

module.exports = router;
