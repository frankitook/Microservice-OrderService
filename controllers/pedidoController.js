const Pedido = require('../models/orderModel');


const crearPedido = async (req, res) => {
    const { metodoPago, idCliente } = req.body;
    const fecha = new Date();

    try {
        
        const clienteResponse = await fetch(`http://localhost:3000/usuarios/${idCliente}`);

        
        if (!clienteResponse.ok) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        
        const nuevoPedido = await Pedido.create({
            idCliente,
            metodoPago,
            total: 0,  
            fecha
        });
        
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
    const { metodoPago, total, estado, comprobante } = req.body; 

    try {
        const pedido = await Pedido.findOne({ where: { idOrder } });
        if (pedido) {
            const nuevosDatos = {};
            if (metodoPago !== undefined) nuevosDatos.metodoPago = metodoPago;
            if (total !== undefined) nuevosDatos.total = total;
            if (estado !== undefined) nuevosDatos.estado = estado;
            if (comprobante !== undefined) nuevosDatos.comprobante = comprobante; 

            await pedido.update(nuevosDatos);

            const pedidoActualizado = await Pedido.findOne({ where: { idOrder } });
            res.json(pedidoActualizado);
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
    }else{
  
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

        const paymentResponse = await fetch('http://localhost:3003/payment/crear-pago', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentDetails)
        });

        if (!paymentResponse.ok) {
            throw new Error('Error al crear el pago');
        }

        const paymentData = await paymentResponse.json();
        const paymentUrl = paymentData.url;

        res.json({ message: 'Pago creado exitosamente', url: paymentUrl });
    
    
    }
    } catch (error) {
      res.status(500).json({ message: 'Error al finalizar la compra', error: error.message });
    }
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
  
