const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const defineJsonArrayField = (fieldName) => ({
  type: DataTypes.JSON,
  defaultValue: [],
  get() {
    const value = this.getDataValue(fieldName)
    if (Array.isArray(value)) return value
    if (typeof value === 'string' && value.trim()) {
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : [value]
      } catch {
        return [value]
      }
    }
    return []
  },
  set(value) {
    if (Array.isArray(value)) {
      this.setDataValue(fieldName, value)
      return
    }

    if (typeof value === 'string' && value.trim()) {
      try {
        const parsed = JSON.parse(value)
        this.setDataValue(fieldName, Array.isArray(parsed) ? parsed : [value])
        return
      } catch {
        this.setDataValue(fieldName, [value])
        return
      }
    }

    this.setDataValue(fieldName, [])
  },
})

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
  brand: {
    type: DataTypes.STRING(120),
    allowNull: true,
    defaultValue: '',
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
  images: defineJsonArrayField('images'),
  colors: defineJsonArrayField('colors'),
  sizes: defineJsonArrayField('sizes'),
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'products',
  timestamps: true,
})

module.exports = Product
