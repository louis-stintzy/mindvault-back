const { pool } = require('../database');

async function getBoxByIdDM(id) {
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

module.exports = getBoxByIdDM;
