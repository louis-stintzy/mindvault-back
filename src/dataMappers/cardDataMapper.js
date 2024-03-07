const { pool } = require('../database');

async function getCardById(id) {
  try {
    const query = 'SELECT * FROM "card" WHERE id = $1';
    const card = await pool.query(query, [id]);
    return card.rows[0];
  } catch (error) {
    console.error('Error during card retrieval:', error);
    throw error;
  }
}

async function getCards(boxId) {
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

async function createCard(boxId, userId, question, answer, attachment) {
  const client = await pool.connect();
  try {
    // On commence une transaction
    await client.query('BEGIN');
    // ----- 1ere requête : Augmentation de la position des cards existantes
    const updatePositionQuery = 'UPDATE "card" SET position = position + 1 WHERE box_id = $1';
    const updatePositionValues = [boxId];
    await client.query(updatePositionQuery, updatePositionValues);
    // ----- 2eme requête : Création de la card
    const insertQuery =
      'INSERT INTO "card" (box_id, creator_id, question, answer, attachment, position, compartment) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const insertValues = [boxId, userId, question, answer, attachment, 1, 1];
    const insertResult = await client.query(insertQuery, insertValues);
    // Valide la transaction si tout est ok et retourne le résultat
    await client.query('COMMIT');
    return insertResult.rows[0];
  } catch (error) {
    console.error('Error during card creation:', error);
    throw error;
  }
}

// TODO Update Card
async function updateCard() {
  console.log('TODO Update Card');
}

async function deleteCard(cardId) {
  try {
    const query = 'DELETE FROM "card" WHERE id = $1';
    await pool.query(query, [cardId]);
  } catch (error) {
    console.error('Error during card deletion:', error);
    throw error;
  }
}

module.exports = {
  getCardById,
  getCards,
  createCard,
  updateCard,
  deleteCard,
};
