const rateLimit = require('express-rate-limit')

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiadas solicitudes, intenta de nuevo más tarde' },
})

// Tighter limit for endpoints that are attractive to brute-force/abuse:
// credential stuffing on login, mass account creation, and card-testing
// (running stolen card numbers) against checkout.
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos, espera unos minutos e inténtalo de nuevo' },
})

module.exports = { globalLimiter, strictLimiter }
