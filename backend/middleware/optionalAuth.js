const jwt = require('jsonwebtoken')
const { User } = require('../models')

// Like middleware/auth.js but never rejects the request — checkout allows
// guests. If a valid token is present, req.user is populated; otherwise
// req.user stays undefined and the route proceeds as a guest order.
module.exports = async (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return next()

  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    req.user = await User.findByPk(decoded.id)
  } catch {
    // invalid/expired token — proceed as guest rather than failing checkout
  }
  next()
}
