const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'user_id',
  },
  customerName: {
    type: DataTypes.STRING(150),
    allowNull: false,
    field: 'customer_name',
  },
  customerEmail: {
    type: DataTypes.STRING(150),
    allowNull: false,
    field: 'customer_email',
  },
  customerPhone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'customer_phone',
  },
  customerAddress: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'customer_address',
  },
  status: {
    type: DataTypes.ENUM('paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
    allowNull: false,
    defaultValue: 'paid',
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  culqiChargeId: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'culqi_charge_id',
  },
}, {
  tableName: 'orders',
  timestamps: true,
})

module.exports = Order
