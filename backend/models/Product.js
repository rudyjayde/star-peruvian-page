const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  minOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 12,
    field: 'min_order',
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  images: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'products',
  timestamps: true,
})

module.exports = Product
