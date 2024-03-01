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

module.exports = {
  getCards,
  createCard,
};
