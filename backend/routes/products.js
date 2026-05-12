const router = require('express').Router()
const { Op } = require('sequelize')
const Product = require('../models/Product')
const authMiddleware = require('../middleware/auth')

// GET all active products (public)
router.get('/', async (req, res) => {
  try {
    const where = { active: true }
    if (req.query.category) where.category = req.query.category

    const products = await Product.findAll({
      where,
      order: [['createdAt', 'DESC']],
    })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos' })
  }
})

// GET all products for admin (protected)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos' })
  }
})

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener producto' })
  }
})

// POST create product (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT update product (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' })
    await product.update(req.body)
    res.json(product)
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
