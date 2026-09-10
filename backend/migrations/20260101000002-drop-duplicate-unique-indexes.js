'use strict'

// sequelize.sync({ alter: true }) re-added a UNIQUE index on every server
// restart because it never recognized its own previously created index name.
// Real damage found: 21 duplicate UNIQUE keys on users.username and 19 on
// reclamaciones.numero_correlativo. This migration keeps the original key
// on each column and drops the rest.
const DUPLICATE_INDEXES = {
  users: Array.from({ length: 20 }, (_, i) => `username_${i + 2}`),
  reclamaciones: Array.from({ length: 18 }, (_, i) => `numero_correlativo_${i + 2}`),
}

module.exports = {
  async up(queryInterface) {
    for (const [table, indexes] of Object.entries(DUPLICATE_INDEXES)) {
      for (const indexName of indexes) {
        await queryInterface.removeIndex(table, indexName)
      }
    }
  },

  async down(queryInterface) {
    for (const [table, indexes] of Object.entries(DUPLICATE_INDEXES)) {
      const column = table === 'users' ? 'username' : 'numero_correlativo'
      for (const indexName of indexes) {
        await queryInterface.addIndex(table, [column], { unique: true, name: indexName })
      }
    }
  },
}
