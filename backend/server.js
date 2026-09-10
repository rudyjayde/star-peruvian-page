require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')
const { sequelize, User } = require('./models')
const { globalLimiter } = require('./middleware/rateLimit')

const app = express()
const PORT = process.env.PORT || 5000
app.set('trust proxy', 1)

const parseOriginList = (...values) => {
  return values
    .flatMap(value => String(value || '').split(','))
    .map(value => value.trim())
    .filter(Boolean)
}

const normalizeOrigin = (value) => {
  if (!value) return ''
  try {
    return new URL(value).origin
  } catch {
    try {
      return new URL(`https://${value}`).origin
    } catch {
      return value.replace(/\/+$/, '')
    }
  }
}

const allowedOrigins = new Set(parseOriginList(
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URLS,
  process.env.PUBLIC_URL,
  process.env.BACKEND_URL,
  process.env.API_URL,
).map(normalizeOrigin))

// Middleware
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true)
    if (process.env.NODE_ENV !== 'production') {
      const devOrigins = new Set(['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3002'])
      if (devOrigins.has(origin)) return callback(null, true)
    }

    const normalized = normalizeOrigin(origin)
    if (allowedOrigins.has(normalized)) return callback(null, true)

    try {
      const { hostname, protocol } = new URL(origin)
      const withoutWww = hostname.replace(/^www\./i, '')
      const withWww = `www.${withoutWww}`
      for (const configured of allowedOrigins) {
        const configuredUrl = new URL(configured)
        const configuredHost = configuredUrl.hostname.replace(/^www\./i, '')
        if (withoutWww === configuredHost || withWww === configuredHost || hostname === configuredUrl.hostname) {
          return callback(null, true)
        }
        if (protocol === configuredUrl.protocol && withoutWww === configuredHost) {
          return callback(null, true)
        }
      }
    } catch {
      // fall through to rejection
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`))
  },
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// Serve uploaded images (legacy — new uploads go to Cloudinary, this stays
// only so pre-existing /uploads/... image URLs already in the DB keep working)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api', globalLimiter)

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/categories', require('./routes/categories'))
app.use('/api/upload', require('./routes/upload'))
app.use('/api/checkout', require('./routes/checkout'))
app.use('/api/reclamaciones', require('./routes/reclamaciones'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', db: 'mysql' }))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Error interno' })
})

// Connect to MySQL and sync tables
const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ MySQL conectado')

    // Tables/associations are managed via migrations, run with
    // `npx sequelize-cli db:migrate` — never sync/alter automatically here.

    // Seed admin user if not exists
    const existing = await User.findOne({ where: { username: 'admin' } })
    if (!existing) {
      const adminPass = process.env.ADMIN_PASSWORD || 'admin123'
      await User.create({ username: 'admin', password: adminPass, role: 'admin' })
      console.log('👤 Usuario admin creado')
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('❌ Error al conectar MySQL:', err.message)
    console.log('')
    console.log('💡 Verifica que:')
    console.log('   1. MySQL esté corriendo')
    console.log('   2. La base de datos "star_peruvian" exista')
    console.log('   3. El usuario y contraseña en .env sean correctos')
    process.exit(1)
  }
}

startServer()
