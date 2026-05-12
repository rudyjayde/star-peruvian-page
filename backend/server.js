require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')
const sequelize = require('./database')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/upload', require('./routes/upload'))
app.use('/api/reclamaciones', require('./routes/reclamaciones'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', db: 'postgresql' }))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Error interno' })
})

// Connect to PostgreSQL and sync tables
const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ PostgreSQL conectado')

    // Load all models before sync so tables are created
    require('./models/User')
    require('./models/Product')
    require('./models/Reclamacion')

    // Sync all models (creates tables if they don't exist)
    await sequelize.sync({ alter: true })
    console.log('✅ Tablas sincronizadas')

    // Seed admin user if not exists
    const User = require('./models/User')
    const existing = await User.findOne({ where: { username: 'admin' } })
    if (!existing) {
      await User.create({ username: 'admin', password: 'admin123', role: 'admin' })
      console.log('👤 Usuario admin creado — usuario: admin / contraseña: admin123')
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('❌ Error al conectar PostgreSQL:', err.message)
    console.log('')
    console.log('💡 Verifica que:')
    console.log('   1. PostgreSQL esté corriendo')
    console.log('   2. La base de datos "star_peruvian" exista en pgAdmin')
    console.log('   3. El usuario y contraseña en .env sean correctos')
    process.exit(1)
  }
}

startServer()
