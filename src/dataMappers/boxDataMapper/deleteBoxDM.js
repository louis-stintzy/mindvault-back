const { pool } = require('../database');

async function deleteBoxDM(boxId) {
  try {
    const query = 'DELETE FROM "box" WHERE id = $1';
    await pool.query(query, [boxId]);
  } catch (error) {
    console.error('Error during box deletion:', error);
    throw error;
  }
}

module.exports = deleteBoxDM;
