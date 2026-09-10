'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      password: { type: Sequelize.STRING(255), allowNull: false },
      role: { type: Sequelize.ENUM('admin', 'editor', 'user'), defaultValue: 'user' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    })

    await queryInterface.createTable('products', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(200), allowNull: false },
      category: { type: Sequelize.STRING(100), allowNull: false },
      brand: { type: Sequelize.STRING(120), allowNull: true, defaultValue: '' },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      stock: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      min_order: { type: Sequelize.INTEGER, defaultValue: 12 },
      description: { type: Sequelize.TEXT, defaultValue: '' },
      images: { type: Sequelize.JSON, defaultValue: [] },
      colors: { type: Sequelize.JSON, defaultValue: [] },
      sizes: { type: Sequelize.JSON, defaultValue: [] },
      active: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    })

    await queryInterface.createTable('reclamaciones', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: Sequelize.STRING, allowNull: false },
      apellido: { type: Sequelize.STRING, allowNull: false },
      dni: { type: Sequelize.STRING(15), allowNull: false },
      telefono: { type: Sequelize.STRING(20), allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      direccion: { type: Sequelize.STRING, allowNull: true },
      tipo_bien: { type: Sequelize.ENUM('producto', 'servicio'), allowNull: false },
      descripcion_bien: { type: Sequelize.TEXT, allowNull: false },
      monto: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      tipo_reclamo: { type: Sequelize.ENUM('reclamo', 'queja'), allowNull: false, defaultValue: 'reclamo' },
      detalle_reclamo: { type: Sequelize.TEXT, allowNull: false },
      pedido_consumidor: { type: Sequelize.TEXT, allowNull: false },
      numero_correlativo: { type: Sequelize.STRING(20), unique: true },
      estado: { type: Sequelize.ENUM('pendiente', 'en_proceso', 'resuelto', 'cerrado'), defaultValue: 'pendiente' },
      respuesta: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reclamaciones')
    await queryInterface.dropTable('products')
    await queryInterface.dropTable('users')
  },
}
