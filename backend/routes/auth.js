const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const authMiddleware = require('../middleware/auth')
const { strictLimiter } = require('../middleware/rateLimit')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

// Login
router.post('/login', strictLimiter, async (req, res) => {
  const { username, password } = req.body
  if (!username || !password)
    return res.status(400).json({ message: 'Usuario y contraseña requeridos' })

  try {
    const user = await User.findOne({ where: { username } })
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Credenciales incorrectas' })

    res.json({ token: signToken(user.id), user })
  } catch {
    res.status(500).json({ message: 'Error del servidor' })
  }
})

// Register
router.post('/register', strictLimiter, async (req, res) => {
  const { username, password } = req.body
  if (!username || !password)
    return res.status(400).json({ message: 'Usuario y contraseña requeridos' })

  if (username.length < 3)
    return res.status(400).json({ message: 'El usuario debe tener al menos 3 caracteres' })

  if (password.length < 6)
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' })

  try {
    const existing = await User.findOne({ where: { username } })
    if (existing)
      return res.status(409).json({ message: 'Ese nombre de usuario ya está en uso' })

    // New users always get role 'user' — only manually set admin in DB
    const user = await User.create({ username, password, role: 'user' })
    res.status(201).json({ token: signToken(user.id), user })
  } catch {
    res.status(500).json({ message: 'Error del servidor' })
  }
})

// Get current user
router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user)
})

module.exports = router
