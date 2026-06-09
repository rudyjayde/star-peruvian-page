const router = require('express').Router()
const { Op } = require('sequelize')
const Product = require('../models/Product')
const authMiddleware = require('../middleware/auth')
const { toPublicUrl } = require('../utils/publicUrl')

const normalizeBrand = (value) => String(value || '').trim().replace(/\s+/g, ' ').toUpperCase()

const normalizeImages = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [value]
    } catch {
      return [value]
    }
  }
  return []
}

const normalizeTextList = (value) => {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean)
  }

  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        return parsed.map(item => String(item).trim()).filter(Boolean)
      }
    } catch {
      return value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
    }
  }

  return []
}

const serializeProduct = (product, req) => {
  const data = product.get({ plain: true })
  data.images = normalizeImages(data.images).map(image => toPublicUrl(req, image))
  data.colors = normalizeTextList(data.colors)
  data.sizes = normalizeTextList(data.sizes)
  data.brand = normalizeBrand(data.brand)
  return data
}

const publicProductOrder = [
  ['category', 'ASC'],
  ['brand', 'ASC'],
  ['name', 'ASC'],
  ['createdAt', 'DESC'],
]

// GET all active products (public)
router.get('/', async (req, res) => {
  try {
    const where = { active: true }
    if (req.query.category) where.category = req.query.category
    if (req.query.brand) where.brand = normalizeBrand(req.query.brand)

    const products = await Product.findAll({
      where,
      order: publicProductOrder,
    })
    res.json(products.map(product => serializeProduct(product, req)))
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos' })
  }
})

// GET all products for admin (protected)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] })
    res.json(products.map(product => serializeProduct(product, req)))
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos' })
  }
})

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' })
    res.json(serializeProduct(product, req))
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener producto' })
  }
})

// POST create product (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const payload = { ...req.body, images: normalizeImages(req.body.images) }
    payload.brand = normalizeBrand(payload.brand)
    payload.colors = normalizeTextList(payload.colors)
    payload.sizes = normalizeTextList(payload.sizes)
    const product = await Product.create(payload)
    res.status(201).json(serializeProduct(product, req))
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT update product (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' })
    const payload = { ...req.body, images: normalizeImages(req.body.images) }
    payload.brand = normalizeBrand(payload.brand)
    payload.colors = normalizeTextList(payload.colors)
    payload.sizes = normalizeTextList(payload.sizes)
    await product.update(payload)
    res.json(serializeProduct(product, req))
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE product (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' })
    await product.destroy()
    res.json({ message: 'Producto eliminado correctamente' })
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar producto' })
  }
})

module.exports = router
