// note : pb règles d'endentation entre ES Lint et prettier ?
/* eslint-disable indent */

// const client = require('../database');
const { pool } = require('../database');

// ----- getBoxById -----
async function getBoxById(id) {
  try {
    const query = `
    SELECT
    box.*,
    picture.picture_url,
    picture.photographer_name,
    picture.photographer_profile_url
    FROM "box"
    LEFT JOIN "picture" ON box.picture_id = picture.id
    WHERE box.id = $1`;
    const result = await pool.query(query, [id]);
    const box = result.rows[0];
    if (box) {
      // On retire les infos de l'image de l'objet box et on les place dans un objet picture
      // 'picture_url: pictureUrl' extrait la propriété picture_url de l'objet box et l'assigne à une nouvelle variable pictureUrl.
      // pictureUrl = '' assigne la valeur par défaut '' à pictureUrl si box.picture_url est undefined
      // ...rest collecte toutes les propriétés de box sauf picture_url, photographer_name, et photographer_profile_url dans un nouvel objet nommé rest
      const {
        picture_url: pictureUrl = '',
        photographer_name: photographerName = '',
        photographer_profile_url: photographerProfileUrl = '',
        ...rest
      } = box;
      return {
        ...rest,
        picture: {
          pictureUrl,
          photographerName,
          photographerProfileUrl,
        },
      };
    }
    return null;
  } catch (error) {
    console.error('Error during box retrieval:', error);
    throw error;
  }
}

// ----- getBoxes -----
async function getBoxes(userId) {
  try {
    // TODO : Charger boite 5 par 5
    const query = `
      SELECT
      box.*,
      picture.picture_url,
      picture.photographer_name,
      picture.photographer_profile_url,
      (SELECT COUNT(*) FROM "card" WHERE "card".box_id = box.id AND "card".date_to_ask::date <= CURRENT_DATE) AS cards_to_review
      FROM "box"
      LEFT JOIN "picture" ON box.picture_id = picture.id
      WHERE box.owner_id = $1
      ORDER BY box.position ASC
      `;
    const boxesList = await pool.query(query, [userId]);
    return boxesList.rows.map((box) => {
      // On retire les infos de l'image de l'objet box et on les place dans un objet picture
      // ...rest collecte toutes les propriétés de box sauf picture_url, photographer_name, et photographer_profile_url dans un nouvel objet nommé rest
      const {
        picture_url: pictureUrl = '',
        photographer_name: photographerName = '',
        photographer_profile_url: photographerProfileUrl = '',
        ...rest
      } = box;
      return {
        ...rest,
        picture: {
          pictureUrl,
          photographerName,
          photographerProfileUrl,
        },
      };
    });
  } catch (error) {
    console.error('Error during boxes retrieval:', error);
    throw error;
  }
}

// ----- createBox -----
async function createBox(
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

// ----- updateBox -----
async function updateBox(
  boxId,
  {
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
    photographerProfileUrl,
  }
) {
  const client = await pool.connect();
  let pictureData = null;
  try {
    await client.query('BEGIN');
    const query = `
    UPDATE "box"
    SET
    name = $1,
    description = $2,
    color = $3,
    label = $4,
    level = $5,
    default_question_language = $6,
    default_question_voice = $7,
    default_answer_language = $8,
    default_answer_voice = $9,
    learn_it = $10,
    type = $11
    WHERE id = $12
    RETURNING *
  `;
    const values = [
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
      boxId,
    ];
    // todo choisir une seule méthode de retour { rows } ou...
    const { rows } = await pool.query(query, values);

    if (pictureUrl) {
      // Upsert permet de créer une nouvelle ligne si elle n'existe pas, ou de la mettre à jour si elle existe
      // ON CONFLICT (box_id) DO UPDATE indique que si une ligne avec le même box_id existe déjà, les colonnes url, photographer_name et photographer_profile_url doivent être mises à jour
      // EXCLUDED fait référence aux valeurs qui auraient été insérées si le conflit n'avait pas eu lieu.
      const upsertPictureQuery = `
      INSERT INTO "picture" (box_id, picture_url, photographer_name, photographer_profile_url)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (box_id) DO UPDATE
      SET picture_url = EXCLUDED.picture_url,
      photographer_name = EXCLUDED.photographer_name,
      photographer_profile_url = EXCLUDED.photographer_profile_url
      RETURNING *
      `;
      const pictureValues = [boxId, pictureUrl, photographerName, photographerProfileUrl];
      const insertPictureResult = await client.query(upsertPictureQuery, pictureValues);
      pictureData = {
        id: insertPictureResult.rows[0].id,
        pictureUrl: insertPictureResult.rows[0].picture_url,
        photographerName: insertPictureResult.rows[0].photographer_name,
        photographerProfileUrl: insertPictureResult.rows[0].photographer_profile_url,
      };
    } else {
      pictureData = {
        pictureUrl: '',
        photographerName: '',
        photographerProfileUrl: '',
      };
    }
    await client.query('COMMIT');
    return { ...rows[0], picture: pictureData };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during box update:', error);
    throw error;
  }
}

// ----- updateBoxLearnItValue -----
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

// ----- deleteBox -----
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
