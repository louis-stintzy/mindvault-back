const { pool } = require('../database');

async function createBoxDM(
  userId,
  name,
  description,
  color,
  label,
  level,
  defaultQuestionLanguage,
  defaultQuestionVoice,
  defaultAnswerLanguage,
  defaultAnswerVoice,
  learnIt,
  type,
  pictureUrl,
  photographerName,
  photographerProfileUrl
) {
  const client = await pool.connect();

  try {
    // On commence une transaction
    await client.query('BEGIN');
    // nous sert à stocker les infos liées à l'image (et les sortir du if (boxPicturePath) { ... })
    let pictureData = null;

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
          'INSERT INTO "box" (owner_id, original_box_creator_id, name, description, color, label, level, default_question_language, default_question_voice, default_answer_language, default_answer_voice, position, learn_it, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *';
        const insertValues = [
          userId,
          userId,
          name,
          description,
          color,
          label,
          level,
          defaultQuestionLanguage,
          defaultQuestionVoice,
          defaultAnswerLanguage,
          defaultAnswerVoice,
          1,
          learnIt,
          type,
        ];
        const insertResult = await client.query(insertQuery, insertValues);
        const newBoxId = insertResult.rows[0].id;
        const newBoxCreatedAt = insertResult.rows[0].created_at;
        // ----- 3eme et 4ème requête : Enregistrement de l'image de la box et mise à jour de la box
        if (pictureUrl) {
          const insertPictureQuery =
            'INSERT INTO "picture" (box_id, picture_url, photographer_name, photographer_profile_url) VALUES ($1, $2, $3, $4) RETURNING *';
          const insertPictureValues = [newBoxId, pictureUrl, photographerName, photographerProfileUrl];
          const insertPictureResult = await client.query(insertPictureQuery, insertPictureValues);
          pictureData = {
            pictureUrl: insertPictureResult.rows[0].picture_url,
            photographerName: insertPictureResult.rows[0].photographer_name,
            photographerProfileUrl: insertPictureResult.rows[0].photographer_profile_url,
          };
          const pictureId = insertPictureResult.rows[0].id;
          // 4ème requête : Mise à jour de la box avec l'id de l'image
          const updateBoxQuery = 'UPDATE "box" SET picture_id = $1 WHERE id = $2';
          const updateBoxValues = [pictureId, newBoxId];
          await client.query(updateBoxQuery, updateBoxValues);
        } else {
          pictureData = {
            pictureUrl: '',
            photographerName: '',
            photographerProfileUrl: '',
          };
        }

        // ----- 5eme requête : Enregistrement des infos résultant de la création de la box
        const updateQuery =
          'UPDATE "box" SET original_box_id = $1, original_box_created_at = $2 WHERE id=$3 RETURNING *';
        const updateValues = [newBoxId, newBoxCreatedAt, newBoxId];
        const updateResult = await client.query(updateQuery, updateValues);
        // Valide la transaction si tout est ok et retourne le résultat
        await client.query('COMMIT');
        // TODO: Selectionner les infos retournées, voir dans le RETURNING
        return {
          ...updateResult.rows[0],
          picture: pictureData,
        };
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

module.exports = createBoxDM;
