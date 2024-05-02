const { pool } = require('../database');

async function getRandomCards(boxId) {
  try {
    const query = `
            SELECT * FROM "card"
            WHERE box_id = $1
            AND date_to_ask::date <= CURRENT_DATE
            AND compartment < 8
            ORDER BY RANDOM() LIMIT 10;
            `;
    const cards = await pool.query(query, [boxId]);
    const adaptedCards = cards.rows.map((card) => ({
      ...card,
      boxId: card.box_id,
      questionLanguage: card.question_language,
      questionVoice: card.question_voice,
      answerLanguage: card.answer_language,
      answerVoice: card.answer_voice,
    }));
    return adaptedCards;
  } catch (error) {
    console.error('Error during cards retrieval:', error);
    throw error;
  }
}

async function updateCardAttributes(cardId, nextCompartment, nextDateToAsk) {
  try {
    const query = `
                UPDATE "card"
                SET date_to_ask = $1, compartment = $2, updated_at = NOW()
                WHERE id = $3
                RETURNING *;
                `;
    const updatedCard = await pool.query(query, [nextDateToAsk, nextCompartment, cardId]);
    return updatedCard.rows[0];
  } catch (error) {
    console.error('Error during updating card attributes:', error);
    throw error;
  }
}

module.exports = {
  getRandomCards,
  updateCardAttributes,
};
