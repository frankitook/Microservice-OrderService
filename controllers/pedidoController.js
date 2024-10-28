const Pedido = require('../models/orderModel');


const crearPedido = async (req, res) => {
    const { idCliente, metodoPago, total } = req.body;
    const fecha = new Date(); 

    try {
        const nuevoPedido = await Pedido.create({ idCliente, metodoPago, total, fecha });
        res.status(201).json(nuevoPedido);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el pedido', error: error.message });
    }
};


const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll();
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pedidos', error: error.message });
    }
};


const obtenerPedidoPorId = async (req, res) => {
    const { idPedido } = req.params;

    try {
        const pedido = await Pedido.findOne({ where: { idPedido } });
        if (pedido) {
            res.json(pedido);
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el pedido', error: error.message });
    }
};


const actualizarPedido = async (req, res) => {
    const { idPedido } = req.params;
    const { metodoPago, total } = req.body;

    try {
        const pedido = await Pedido.findOne({ where: { idPedido } });
        if (pedido) {
            if (metodoPago !== undefined) {
                pedido.metodoPago = metodoPago;
            }
            if (total !== undefined) {
                pedido.total = total;
            }

            await pedido.save();
            res.json(pedido);
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el pedido', error: error.message });
    }
};


const eliminarPedido = async (req, res) => {
    const { idPedido } = req.params;

    try {
        const pedido = await Pedido.findOne({ where: { idPedido } });
        if (pedido) {
            await pedido.destroy();
            res.json({ message: 'Pedido eliminado' });
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el pedido', error: error.message });
    }
};

module.exports = {
    crearPedido,
    obtenerPedidos,
    obtenerPedidoPorId,
    actualizarPedido,
    eliminarPedido,
};
