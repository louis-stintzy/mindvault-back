const { pool } = require('../database');

async function getBoxesDM(userId) {
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

module.exports = getBoxesDM;
