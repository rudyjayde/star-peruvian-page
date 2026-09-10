'use strict'

const { slugify } = require('../utils/slugify')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'categories', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    })

    // Turn the old free-text `category` values into root Category rows,
    // then point each product at its matching category.
    const [rows] = await queryInterface.sequelize.query(
      'SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != \'\''
    )

    for (const { category } of rows) {
      const slug = slugify(category)
      const [existing] = await queryInterface.sequelize.query(
        'SELECT id FROM categories WHERE slug = :slug LIMIT 1',
        { replacements: { slug } }
      )

      let categoryId = existing[0]?.id
      if (!categoryId) {
        const now = new Date()
        const [insertId] = await queryInterface.sequelize.query(
          'INSERT INTO categories (name, slug, parent_id, createdAt, updatedAt) VALUES (:name, :slug, NULL, :now, :now)',
          { replacements: { name: category, slug, now } }
        )
        categoryId = insertId
      }

      await queryInterface.sequelize.query(
        'UPDATE products SET category_id = :categoryId WHERE category = :category',
        { replacements: { categoryId, category } }
      )
    }

    await queryInterface.changeColumn('products', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    })

    await queryInterface.removeColumn('products', 'category')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'category', {
      type: Sequelize.STRING(100),
      allowNull: true,
    })

    await queryInterface.sequelize.query(`
      UPDATE products p
      JOIN categories c ON c.id = p.category_id
      SET p.category = c.name
    `)

    await queryInterface.changeColumn('products', 'category', {
      type: Sequelize.STRING(100),
      allowNull: false,
    })

    await queryInterface.removeColumn('products', 'category_id')
  },
}
