const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = async (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado' })
  }
  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.id)
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' })
    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}
