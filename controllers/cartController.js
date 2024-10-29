const CartItem = require('../models/orderItemModel');
const Order = require('../models/orderModel');
const axios = require('axios');

const PRODUCT_SERVICE_URL = 'http://localhost:3001/products';

const agregarProductoAlCarrito = async (req, res) => {
  const { idOrder, idProducto, cantidad } = req.params;

  try {
    
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/${idProducto}`);

    
    if (response.status !== 200) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const producto = response.data;

    
    const cartItemExistente = await CartItem.findOne({ where: { idOrder, idProducto } });

    if (cartItemExistente) {
      
      cartItemExistente.cantidad += parseInt(cantidad);
      await cartItemExistente.save();
    } else {
      
      await CartItem.create({
        idOrder,
        idProducto,
        cantidad: parseInt(cantidad),
        precioUnitario: producto.precio
      });
    }

    
    const carrito = await CartItem.findAll({ where: { idOrder } });
    const nuevoTotal = carrito.reduce((total, item) => {
      return total + (item.cantidad * item.precioUnitario);
    }, 0);

   
    await Order.update({ total: nuevoTotal }, { where: { idOrder } });

    
    res.status(201).json({ message: 'Producto agregado al carrito', nuevoTotal });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el producto al carrito', error: error.message });
  }
};
  

const obtenerCarrito = async (req, res) => {
  const { idOrder } = req.params;

  try {
    const carrito = await CartItem.findAll({ where: { idOrder } });

    const carritoConDetalles = await Promise.all(
      carrito.map(async (item) => {
        const response = await axios.get(`${PRODUCT_SERVICE_URL}/${item.idProducto}`);

        if (response.status !== 200) throw new Error('Error al obtener detalles del producto');

        const producto = response.data;
        return {
          ...item.dataValues,
          descripcion: producto.descripcion,
          precio: producto.precio,
        };
      })
    );

    res.json(carritoConDetalles);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
  }
};

const eliminarProductoDelCarrito = async (req, res) => {
  const { idOrder, idProducto } = req.params;

  try {
    
    const item = await CartItem.findOne({ where: { idOrder, idProducto } });
    
    if (item) {
      
      const cantidadARestar = item.cantidad * item.precioUnitario;

      
      await item.destroy();

      
      const order = await Order.findOne({ where: { idOrder } });
      if (order) {
        const nuevoTotal = order.total - cantidadARestar;
        await order.update({ total: nuevoTotal });
      }

      res.json({ message: 'Producto eliminado del carrito', nuevoTotal: order.total });
    } else {
      res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto del carrito', error: error.message });
  }
};

module.exports = {
  agregarProductoAlCarrito,
  obtenerCarrito,
  eliminarProductoDelCarrito,
};


