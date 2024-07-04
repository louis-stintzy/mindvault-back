const { pool } = require('../database');

async function getCardByIdDM(id) {
  try {
    const query = 'SELECT * FROM "card" WHERE id = $1';
    const card = await pool.query(query, [id]);
    return card.rows[0];
  } catch (error) {
    console.error('Error during card retrieval:', error);
    throw error;
  }
}

module.exports = getCardByIdDM;
