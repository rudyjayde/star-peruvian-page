const { DataTypes } = require('sequelize')
const bcrypt = require('bcryptjs')
const sequelize = require('../database')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'editor', 'user'),
    defaultValue: 'user',
  },
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 12)
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12)
      }
    },
  },
})

User.prototype.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

User.prototype.toJSON = function () {
  const values = { ...this.get() }
  delete values.password
  return values
}

module.exports = User
