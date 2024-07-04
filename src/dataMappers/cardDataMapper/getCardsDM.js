const { pool } = require('../database');

async function getCardsDM(boxId) {
  try {
    const query = 'SELECT * FROM "card" WHERE box_id = $1 ORDER BY position ASC';
    const cards = await pool.query(query, [boxId]);
    // TODO : voir problématique des fuseaux horaires (côté back et/ou côté front)
    // l'utilisateur doit avoir les bonnes date_to_ask en fonction de son fuseau horaire
    const adaptedCards = cards.rows.map((card) => ({
      ...card,
      dateToAsk: card.date_to_ask,
    }));
    return adaptedCards;
  } catch (error) {
    console.error('Error during cards retrieval:', error);
    throw error;
  }
}

module.exports = getCardsDM;
