const client = require('../database');

async function getBoxes(userId) {
  try {
    const query = `SELECT * FROM "box" WHERE owner_id = $1`;
    const boxesList = await client.query(query, [userId]);
    return boxesList.rows;
  } catch (error) {
    console.error('Error during box retrieval:', error);
    throw error;
  }
}

async function createBox(userId, name, description, boxPicture, color, label, level, learnIt, type) {
  try {
    // On commence une transaction
    await client.query('BEGIN');

    switch (type) {
      // 1: Box contenant d'autres box
      case '1':
        console.log('BoxDataMapper : Type 1 not yet implemented');
        throw new Error('BoxDataMapper : Type 1 not yet implemented');

      // 2: Box ne contenant pas d'autres box, contenant seulement des cards
      case '2': {
        // 1ere requête : Création de la box
        const insertQuery =
          'INSERT INTO "box" (owner_id, original_box_creator_id, name, description, box_picture, color, label, level, learn_it, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
        const insertValues = [userId, userId, name, description, boxPicture, color, label, level, learnIt, type];
        const insertResult = await client.query(insertQuery, insertValues);
        const newBoxId = insertResult.rows[0].id;
        const newBoxCreatedAt = insertResult.rows[0].created_at;
        // 2eme requête : Enregistrement des infos résultant de la création de la box
        const updateQuery =
          'UPDATE "box" SET original_box_id = $1, original_box_created_at = $2 WHERE id=$3 RETURNING *';
        const updateValues = [newBoxId, newBoxCreatedAt, newBoxId];
        const updateResult = await client.query(updateQuery, updateValues);
        // On commit la transaction et on retourne le résultat
        await client.query('COMMIT');
        // TODO: Selectionner les infos retournées
        return updateResult.rows[0];
      }

      // 3: Box contenue dans une autre box et contenant des cards
      case '3':
        console.log('BoxDataMapper : Type 3 not yet implemented');
        throw new Error('BoxDataMapper : Type 3 not yet implemented');

      // Si le type n'est pas 1, 2 ou 3, on retourne null
      default:
        console.log('BoxDataMapper : Invalid box type');
        throw new Error('BoxDataMapper : Invalid box type');
    }
  } catch (error) {
    // Si une erreur est survenue, on rollback la transaction
    await client.query('ROLLBACK');
    console.error('Error during box creation:', error);
    throw error;
  } finally {
    // On libère le client
    client.release();
  }
}

module.exports = {
  getBoxes,
  createBox,
};
