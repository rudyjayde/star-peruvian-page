require('dotenv').config()

// Falls back to the MYSQL* vars a Railway MySQL plugin injects, so the
// sequelize-cli migrations run in deploy without extra wiring.
const base = {
  username: process.env.DB_USER || process.env.MYSQLUSER,
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
  database: process.env.DB_NAME || process.env.MYSQLDATABASE,
  host: process.env.DB_HOST || process.env.MYSQLHOST,
  port: process.env.DB_PORT || process.env.MYSQLPORT,
  dialect: 'mysql',
}

module.exports = {
  development: base,
  test: base,
  production: base,
}
