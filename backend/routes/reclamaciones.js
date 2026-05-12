const express = require('express')
const router = express.Router()
const Reclamacion = require('../models/Reclamacion')

// POST /api/reclamaciones — submit a new complaint
router.post('/', async (req, res) => {
  try {
    const {
      nombre, apellido, dni, telefono, email, direccion,
      tipo_bien, descripcion_bien, monto,
      tipo_reclamo, detalle_reclamo, pedido_consumidor,
    } = req.body

    // Basic validation
    const required = { nombre, apellido, dni, telefono, email, tipo_bien, descripcion_bien, tipo_reclamo, detalle_reclamo, pedido_consumidor }
    for (const [field, val] of Object.entries(required)) {
      if (!val || !String(val).trim()) {
        return res.status(400).json({ message: `El campo "${field}" es requerido.` })
      }
    }

    const rec = await Reclamacion.create({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      dni: dni.trim(),
      telefono: telefono.trim(),
      email: email.trim().toLowerCase(),
      direccion: direccion?.trim() || null,
      tipo_bien,
      descripcion_bien: descripcion_bien.trim(),
      monto: monto ? parseFloat(monto) : null,
      tipo_reclamo,
      detalle_reclamo: detalle_reclamo.trim(),
      pedido_consumidor: pedido_consumidor.trim(),
    })

    res.status(201).json({
      message: 'Reclamación registrada exitosamente.',
      numero_correlativo: rec.numero_correlativo,
      id: rec.id,
    })
  } catch (err) {
    console.error('Error al guardar reclamación:', err.message)
    res.status(500).json({ message: 'Error interno. Intente nuevamente.' })
  }
})

// GET /api/reclamaciones — admin only, list all
router.get('/', async (req, res) => {
  try {
    const list = await Reclamacion.findAll({ order: [['createdAt', 'DESC']] })
    res.json(list)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener reclamaciones.' })
  }
})

// PUT /api/reclamaciones/:id — admin updates status/response
router.put('/:id', async (req, res) => {
  try {
    const rec = await Reclamacion.findByPk(req.params.id)
    if (!rec) return res.status(404).json({ message: 'Reclamación no encontrada.' })
    const { estado, respuesta } = req.body
    await rec.update({ estado, respuesta })
    res.json(rec)
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar.' })
  }
})

module.exports = router
