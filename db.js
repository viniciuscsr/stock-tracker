const Pool = require('pg').Pool;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://node_user:node_password@localhost:5432/stock_tracker',
  ssl: false,
});

module.exports = pool;
