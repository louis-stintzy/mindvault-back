const { pool } = require('../database');

async function updateBoxDM(
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
        photographer_profile_url = EXCLUDED.photographer_profile_url,
        updated_at = now()
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
        id: null,
        pictureUrl: '',
        photographerName: '',
        photographerProfileUrl: '',
      };
    }

    const query = `
      UPDATE "box"
      SET
      name = $1,
      description = $2,
      picture_id = $3,
      color = $4,
      label = $5,
      level = $6,
      default_question_language = $7,
      default_question_voice = $8,
      default_answer_language = $9,
      default_answer_voice = $10,
      learn_it = $11,
      type = $12,
      updated_at = now()
      WHERE id = $13
      RETURNING *
    `;
    const values = [
      name,
      description,
      pictureData.id,
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

    await client.query('COMMIT');
    return { ...rows[0], picture: pictureData };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during box update:', error);
    throw error;
  }
}

module.exports = updateBoxDM;
