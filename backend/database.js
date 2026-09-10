const { Sequelize } = require('sequelize')

// DB_* are what we set; MYSQL* are what a Railway MySQL plugin injects.
// Falling back to the Railway names means the service works even if the
// DB_* reference variables aren't wired up.
const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE
const dbUser = process.env.DB_USER || process.env.MYSQLUSER
const dbPassword = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
  port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
})

module.exports = sequelize
