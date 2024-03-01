const { pool } = require('../database');

async function getCards(boxId) {
  try {
    const query = 'SELECT * FROM "card" WHERE box_id = $1';
    const cards = await pool.query(query, [boxId]);
    return cards.rows;
  } catch (error) {
    console.error('Error during cards retrieval:', error);
    throw error;
  }
}

module.exports = {
  getCards,
};
