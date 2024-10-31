const Pedido = require('../models/orderModel');


const crearPedido = async (req, res) => {
    const { idOrder, metodoPago, total } = req.body;
    const fecha = new Date(); 

    try {
        const nuevoPedido = await Pedido.create({ idOrder, metodoPago, total, fecha });
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
    const { idOrder } = req.params;

    try {
        const pedido = await Pedido.findOne({ where: { idOrder } });
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
    const { idOrder } = req.params;
    const { metodoPago, total } = req.body;

    try {
        const pedido = await Pedido.findOne({ where: { idOrder } });
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
    const { idOrder } = req.params;

    try {
        const pedido = await Pedido.findOne({ where: { idOrder } });
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


const finalizarCompra = async (req, res) => {
    const { idOrder } = req.params; 
    
    if (!idOrder) {
      return res.status(400).json({ message: 'El ID de la orden es requerido en los parámetros de la URL.' });
    }
  
    try {
      
      const order = await Pedido.findOne({ where: { idOrder: idOrder } }); 
      if (!order) {
        return res.status(404).json({ message: 'Orden no encontrada.' });
      }else{
  
        const { idCliente } = order;
        const response = await fetch(`http://localhost:3000/usuarios/${idCliente}`);
        const clienteData = await response.json();

        const { street_name, street_number } = separa(clienteData.direccion);

        const paymentDetails = {
            id: idOrder,  
            title: "Tienda Moto",  
            description: "Venta de Artículo", 
            amount: order.total, 
            currency: 'ARS',  
            name: clienteData.nombre,  
            surname: clienteData.apellido,  
            email: clienteData.email,  
            zip_code: clienteData.codigoPostal,  
            street_name: clienteData.street_name,  
            street_number: clienteData.street_number  
        };

      await order.update({ estado: 'Pagado' });
  
      res.json({ message: 'Compra finalizada exitosamente.' });
    
    
    }
    } catch (error) {
      res.status(500).json({ message: 'Error al finalizar la compra', error: error.message });
    }
  };



  const separa = (direccion) => {
    const partes = direccion.trim().split(' ');
    const street_number = Number(partes.pop()); 
    const street_name = partes.join(' '); 
    return { street_name, street_number }; 
};

  
  module.exports = {
    crearPedido,
    obtenerPedidos,
    obtenerPedidoPorId,
    actualizarPedido,
    eliminarPedido,
    finalizarCompra
  };
  
