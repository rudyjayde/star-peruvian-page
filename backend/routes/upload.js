const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const authMiddleware = require('../middleware/auth')

const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'product-' + unique + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/
  const ext = allowed.test(path.extname(file.originalname).toLowerCase())
  const mime = allowed.test(file.mimetype)
  if (ext && mime) cb(null, true)
  else cb(new Error('Solo se permiten imágenes (JPG, PNG, WEBP, GIF)'))
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se recibió ninguna imagen' })
  }
  const url = `/uploads/${req.file.filename}`
  res.json({ url, filename: req.file.filename })
})

module.exports = router
