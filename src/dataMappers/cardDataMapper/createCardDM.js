const { pool } = require('../database');

async function createCardDM(
  boxId,
  userId,
  questionLanguage,
  questionVoice,
  answerLanguage,
  answerVoice,
  question,
  answer,
  attachment
) {
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
      'INSERT INTO "card" (box_id, creator_id, question_language, question_voice, answer_language, answer_voice, question, answer, attachment, position, compartment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *';
    const insertValues = [
      boxId,
      userId,
      questionLanguage,
      questionVoice,
      answerLanguage,
      answerVoice,
      question,
      answer,
      attachment,
      1,
      1,
    ];
    const insertResult = await client.query(insertQuery, insertValues);
    const adaptedCard = {
      ...insertResult.rows[0],
      dateToAsk: insertResult.rows[0].date_to_ask,
    };
    // Valide la transaction si tout est ok et retourne le résultat
    await client.query('COMMIT');
    return adaptedCard;
  } catch (error) {
    console.error('Error during card creation:', error);
    throw error;
  }
}

module.exports = createCardDM;
