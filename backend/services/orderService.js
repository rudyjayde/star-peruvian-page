const { sequelize, Product, Order, OrderItem } = require('../models')

class InsufficientStockError extends Error {
  constructor(productName) {
    super(`Sin stock suficiente para "${productName}"`)
    this.name = 'InsufficientStockError'
  }
}

// Prices/stock are always re-read from the DB here — the amount the client
// sent is only used to build the Culqi charge (see routes/checkout.js),
// never trusted to decide what gets sold.
//
// IMPORTANT: the guarded UPDATE runs *before* any SELECT of the same row.
// Reading the row first (e.g. `findByPk`) and updating it afterwards makes
// MariaDB raise "Record has changed since last read" (error 1020) under
// concurrent writes instead of letting our WHERE stock >= quantity guard
// decide — the UPDATE has to be the first touch of the row in the
// transaction for the affectedRows check to be the thing that resolves
// the race.
async function createOrderFromCart({ items, customer, userId, culqiChargeId }) {
  return sequelize.transaction(async (t) => {
    let subtotal = 0
    const lineItems = []

    for (const { productId, quantity } of items) {
      const [, metadata] = await sequelize.query(
        'UPDATE products SET stock = stock - :quantity WHERE id = :productId AND stock >= :quantity',
        { replacements: { quantity, productId }, transaction: t }
      )

      if (metadata.affectedRows === 0) {
        const product = await Product.findByPk(productId, { transaction: t })
        if (!product) throw new Error(`Producto ${productId} no existe`)
        throw new InsufficientStockError(product.name)
      }

      const product = await Product.findByPk(productId, { transaction: t })
      const lineSubtotal = Number(product.price) * quantity
      subtotal += lineSubtotal
      lineItems.push({
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity,
        subtotal: lineSubtotal,
      })
    }

    const order = await Order.create({
      userId: userId || null,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerAddress: customer.address || null,
      status: 'paid',
      subtotal,
      total: subtotal,
      culqiChargeId,
    }, { transaction: t })

    await OrderItem.bulkCreate(
      lineItems.map(item => ({ ...item, orderId: order.id })),
      { transaction: t }
    )

    return order
  })
}

module.exports = { createOrderFromCart, InsufficientStockError }
