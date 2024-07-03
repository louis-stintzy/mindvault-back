const { pool } = require('../database');

async function updateBoxLearnItValueDM(boxId, learnIt) {
  try {
    const query = 'UPDATE "box" SET learn_it = $1 WHERE id = $2 RETURNING learn_it';
    const { rows } = await pool.query(query, [learnIt, boxId]);
    return { learn_it: rows[0].learn_it };
  } catch (error) {
    console.error('Error during updating Learn it state:', error);
    throw error;
  }
}

module.exports = updateBoxLearnItValueDM;
