const { DataTypes } = require('sequelize');
const base = require('../configuration/db');

const OrderItem = base.define('OrderItem', {
  idOrderItem: {type: DataTypes.INTEGER,primaryKey: true,autoIncrement: true,
  },
  idOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'idOrder',
    },},
  idProducto: {type: DataTypes.INTEGER, allowNull: false,},
  cantidad: {type: DataTypes.INTEGER,allowNull: false,},
  precioUnitario: {type: DataTypes.FLOAT,allowNull: false,},
}, {
  tableName: 'order_items',
  timestamps: false,
});

module.exports = OrderItem;
