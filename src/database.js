// const { Client } = require('pg');

// const client = new Client(process.env.PG_URL);

// client.connect();

// module.exports = client;

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
