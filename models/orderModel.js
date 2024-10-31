const { DataTypes } = require('sequelize');
const base = require('../configuration/db');

const Order = base.define('Order', {
  idOrder: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idCliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pendiente',
  },
  metodoPago: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  comprobante: {
    type: DataTypes.STRING, 
    allowNull: true, 
  },
}, {
  tableName: 'orders',
  timestamps: false,
});

module.exports = Order;
