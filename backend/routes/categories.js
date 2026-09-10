const router = require('express').Router()
const { Category } = require('../models')
const authMiddleware = require('../middleware/auth')
const { slugify } = require('../utils/slugify')
const { buildTree, collectDescendantIds } = require('../utils/categoryTree')

const uniqueSlug = async (name, ignoreId = null) => {
  const base = slugify(name)
  let slug = base
  let suffix = 2
  while (true) {
    const existing = await Category.findOne({ where: { slug } })
    if (!existing || existing.id === ignoreId) return slug
    slug = `${base}-${suffix++}`
  }
}

// GET tree (public — used by the nav and the catalog filters)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] })
    res.json(buildTree(categories))
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener categorías' })
  }
})

// POST create (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const name = String(req.body.name || '').trim()
    if (!name) return res.status(400).json({ message: 'El nombre es requerido' })

    const parentId = req.body.parentId ? Number(req.body.parentId) : null
    if (parentId) {
      const parent = await Category.findByPk(parentId)
      if (!parent) return res.status(400).json({ message: 'Categoría padre no encontrada' })
    }

    const slug = await uniqueSlug(name)
    const category = await Category.create({ name, slug, parentId })
    res.status(201).json(category)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT update (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id)
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' })

    const name = String(req.body.name || category.name).trim()
    const parentId = req.body.parentId !== undefined
      ? (req.body.parentId ? Number(req.body.parentId) : null)
      : category.parentId

    if (parentId === category.id) {
      return res.status(400).json({ message: 'Una categoría no puede ser su propio padre' })
    }
    if (parentId) {
      const all = await Category.findAll()
      const descendants = collectDescendantIds(all, category.id)
      if (descendants.includes(parentId)) {
        return res.status(400).json({ message: 'No se puede mover una categoría dentro de su propia subcategoría' })
      }
    }

    const slug = name !== category.name ? await uniqueSlug(name, category.id) : category.slug
    await category.update({ name, slug, parentId })
    res.json(category)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE (protected) — children are promoted to root (ON DELETE SET NULL);
// blocked at the DB level if the category still has products assigned.
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id)
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' })
    await category.destroy()
    res.json({ message: 'Categoría eliminada correctamente' })
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ message: 'No se puede eliminar: hay productos en esta categoría. Reasígnalos primero.' })
    }
    res.status(500).json({ message: 'Error al eliminar categoría' })
  }
})

module.exports = router
