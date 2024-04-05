// const client = require('../database');
const { pool } = require('../database');

async function getBoxById(id) {
  try {
    const query = `SELECT * FROM "box" WHERE id = $1`;
    const box = await pool.query(query, [id]);
    return box.rows[0];
  } catch (error) {
    console.error('Error during box retrieval:', error);
    throw error;
  }
}

async function getBoxes(userId) {
  try {
    // TODO : Charger boite 5 par 5
    const query = `
      SELECT
      box.*,
      (SELECT COUNT(*) FROM "card" WHERE "card".box_id = box.id AND "card".date_to_ask::date <= CURRENT_DATE) AS cards_to_review
      FROM "box"
      WHERE box.owner_id = $1
      ORDER BY box.position ASC
      `;
    const boxesList = await pool.query(query, [userId]);
    return boxesList.rows;
  } catch (error) {
    console.error('Error during boxes retrieval:', error);
    throw error;
  }
}

async function createBox(
  userId,
  name,
  description,
  boxPicture,
  color,
  label,
  level,
  defaultQuestionLanguage,
  defaultAnswerLanguage,
  learnIt,
  type
) {
  const client = await pool.connect();

  try {
    // On commence une transaction
    await client.query('BEGIN');

    switch (type) {
      // 1: Box contenant d'autres box
      case 1:
        console.log('BoxDataMapper : Type 1 not yet implemented');
        throw new Error('BoxDataMapper : Type 1 not yet implemented');

      // 2: Box ne contenant pas d'autres box, contenant seulement des cards
      case 2: {
        // ----- 1ere requête : Augmentation de la position des boxes existantes
        const updatePositionQuery = 'UPDATE "box" SET position = position + 1 WHERE owner_id = $1';
        const updatePositionValues = [userId];
        await client.query(updatePositionQuery, updatePositionValues);
        // ----- 2eme requête : Création de la box
        const insertQuery =
          'INSERT INTO "box" (owner_id, original_box_creator_id, name, description, box_picture, color, label, level, default_question_language, default_answer_language, position, learn_it, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *';
        const insertValues = [
          userId,
          userId,
          name,
          description,
          boxPicture,
          color,
          label,
          level,
          defaultQuestionLanguage,
          defaultAnswerLanguage,
          1,
          learnIt,
          type,
        ];
        const insertResult = await client.query(insertQuery, insertValues);
        const newBoxId = insertResult.rows[0].id;
        const newBoxCreatedAt = insertResult.rows[0].created_at;
        // ----- 3eme requête : Enregistrement des infos résultant de la création de la box
        const updateQuery =
          'UPDATE "box" SET original_box_id = $1, original_box_created_at = $2 WHERE id=$3 RETURNING *';
        const updateValues = [newBoxId, newBoxCreatedAt, newBoxId];
        const updateResult = await client.query(updateQuery, updateValues);
        // Valide la transaction si tout est ok et retourne le résultat
        await client.query('COMMIT');
        // TODO: Selectionner les infos retournées, voir dans le RETURNING
        return updateResult.rows[0];
      }

      // 3: Box contenue dans une autre box et contenant des cards
      case 3:
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

// TODO Update Box
async function updateBox() {
  console.log('TODO Update Box');
}

async function updateBoxLearnItValue(boxId, learnIt) {
  try {
    const query = 'UPDATE "box" SET learn_it = $1 WHERE id = $2 RETURNING learn_it';
    const { rows } = await pool.query(query, [learnIt, boxId]);
    return { learn_it: rows[0].learn_it };
  } catch (error) {
    console.error('Error during updating Learn it state:', error);
    throw error;
  }
}

async function deleteBox(boxId) {
  try {
    const query = 'DELETE FROM "box" WHERE id = $1';
    await pool.query(query, [boxId]);
  } catch (error) {
    console.error('Error during box deletion:', error);
    throw error;
  }
}

module.exports = {
  getBoxById,
  getBoxes,
  createBox,
  updateBox,
  updateBoxLearnItValue,
  deleteBox,
};
