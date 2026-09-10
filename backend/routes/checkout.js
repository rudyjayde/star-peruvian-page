const router = require('express').Router()
const { Product } = require('../models')
const { createCharge, refundCharge } = require('../services/culqi')
const { createOrderFromCart, InsufficientStockError } = require('../services/orderService')
const optionalAuth = require('../middleware/optionalAuth')
const { strictLimiter } = require('../middleware/rateLimit')

const toCents = (amount) => Math.round(Number(amount) * 100)

// Order of operations matters: charge Culqi FIRST, only create the order
// (and touch stock) if the charge succeeds. If the charge succeeds but
// order creation fails afterwards for any reason, auto-refund — nobody
// should end up charged with no order.
router.post('/', strictLimiter, optionalAuth, async (req, res) => {
  const { items, customer, culqiToken } = req.body

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'El carrito está vacío' })
  }
  if (!customer?.name || !customer?.email || !customer?.phone) {
    return res.status(400).json({ message: 'Nombre, email y teléfono son requeridos' })
  }
  if (!culqiToken) {
    return res.status(400).json({ message: 'Falta el token de pago' })
  }

  let subtotal = 0
  try {
    for (const { productId, quantity } of items) {
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ message: 'Cantidad inválida' })
      }
      const product = await Product.findByPk(productId)
      if (!product || !product.active) {
        return res.status(400).json({ message: `Producto ${productId} no disponible` })
      }
      if (quantity < (product.minOrder || 1)) {
        return res.status(400).json({ message: `"${product.name}" requiere un mínimo de ${product.minOrder} unidades` })
      }
      subtotal += Number(product.price) * quantity
    }
  } catch {
    return res.status(500).json({ message: 'Error al validar el carrito' })
  }

  const amountInCents = toCents(subtotal)

  let charge
  try {
    charge = await createCharge({
      amountInCents,
      email: customer.email,
      sourceId: culqiToken,
      description: `Pedido Star Peruvian - ${customer.name}`,
    })
  } catch (err) {
    return res.status(402).json({ message: err.message || 'El pago fue rechazado' })
  }

  try {
    const order = await createOrderFromCart({
      items,
      customer,
      userId: req.user?.id,
      culqiChargeId: charge.id,
    })
    return res.status(201).json({ orderId: order.id, total: order.total })
  } catch (err) {
    try {
      await refundCharge(charge.id, amountInCents)
    } catch (refundErr) {
      console.error('❌ CRITICO: pago cobrado pero no se pudo crear la orden NI reembolsar', {
        chargeId: charge.id,
        customer: customer.email,
        error: refundErr.message,
      })
      return res.status(500).json({
        message: 'El pago se procesó pero hubo un error al crear tu pedido. Nuestro equipo te contactará para resolverlo.',
      })
    }

    const message = err instanceof InsufficientStockError
      ? err.message
      : 'No se pudo completar el pedido, el pago fue reembolsado automáticamente'
    return res.status(409).json({ message })
  }
})

module.exports = router
