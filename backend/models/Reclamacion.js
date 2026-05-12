const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const Reclamacion = sequelize.define('Reclamacion', {
  // Datos del consumidor
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dni: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Datos del bien o servicio
  tipo_bien: {
    type: DataTypes.ENUM('producto', 'servicio'),
    allowNull: false,
  },
  descripcion_bien: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },

  // Detalle de la reclamación
  tipo_reclamo: {
    type: DataTypes.ENUM('reclamo', 'queja'),
    allowNull: false,
    defaultValue: 'reclamo',
  },
  detalle_reclamo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  pedido_consumidor: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  // Estado interno
  numero_correlativo: {
    type: DataTypes.STRING(20),
    unique: true,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'en_proceso', 'resuelto', 'cerrado'),
    defaultValue: 'pendiente',
  },
  respuesta: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'reclamaciones',
  timestamps: true,
  hooks: {
    beforeCreate: async (rec) => {
      const count = await Reclamacion.count()
      const year = new Date().getFullYear()
      rec.numero_correlativo = `SP-${year}-${String(count + 1).padStart(4, '0')}`
    },
  },
})

module.exports = Reclamacion
