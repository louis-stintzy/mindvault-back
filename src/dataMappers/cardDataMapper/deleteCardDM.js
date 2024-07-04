const { pool } = require('../database');

async function deleteCardDM(cardId) {
  try {
    const query = 'DELETE FROM "card" WHERE id = $1';
    await pool.query(query, [cardId]);
  } catch (error) {
    console.error('Error during card deletion:', error);
    throw error;
  }
}

module.exports = deleteCardDM;
