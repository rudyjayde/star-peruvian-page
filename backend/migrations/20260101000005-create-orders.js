'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      customer_name: { type: Sequelize.STRING(150), allowNull: false },
      customer_email: { type: Sequelize.STRING(150), allowNull: false },
      customer_phone: { type: Sequelize.STRING(20), allowNull: false },
      customer_address: { type: Sequelize.STRING(255), allowNull: true },
      status: {
        type: Sequelize.ENUM('paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
        allowNull: false,
        defaultValue: 'paid',
      },
      subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      total: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      culqi_charge_id: { type: Sequelize.STRING(50), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    })

    await queryInterface.createTable('order_items', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      product_name: { type: Sequelize.STRING(200), allowNull: false },
      unit_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    })

    await queryInterface.addIndex('orders', ['user_id'])
    await queryInterface.addIndex('order_items', ['order_id'])
    await queryInterface.addIndex('order_items', ['product_id'])
  },

  async down(queryInterface) {
    await queryInterface.dropTable('order_items')
    await queryInterface.dropTable('orders')
  },
}
