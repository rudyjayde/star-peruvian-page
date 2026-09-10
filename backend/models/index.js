const sequelize = require('../database')
const User = require('./User')
const Product = require('./Product')
const Category = require('./Category')
const Reclamacion = require('./Reclamacion')
const Order = require('./Order')
const OrderItem = require('./OrderItem')

Category.hasMany(Category, { as: 'children', foreignKey: 'parentId' })
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' })

Category.hasMany(Product, { foreignKey: 'categoryId' })
Product.belongsTo(Category, { foreignKey: 'categoryId' })

Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' })
OrderItem.belongsTo(Order, { foreignKey: 'orderId' })

Product.hasMany(OrderItem, { foreignKey: 'productId' })
OrderItem.belongsTo(Product, { foreignKey: 'productId' })

User.hasMany(Order, { foreignKey: 'userId' })
Order.belongsTo(User, { foreignKey: 'userId' })

module.exports = { sequelize, User, Product, Category, Reclamacion, Order, OrderItem }
