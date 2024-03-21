const { pool } = require('../database');

async function getInstantStats(boxId) {
  try {
    const query = `
                SELECT
                    COUNT(*) AS totalCards,
                    COUNT(*) FILTER (WHERE compartment = 1) AS compartment1,
                    COUNT(*) FILTER (WHERE compartment = 2) AS compartment2,
                    COUNT(*) FILTER (WHERE compartment = 3) AS compartment3,
                    COUNT(*) FILTER (WHERE compartment = 4) AS compartment4,
                    COUNT(*) FILTER (WHERE compartment = 5) AS compartment5,
                    COUNT(*) FILTER (WHERE compartment = 6) AS compartment6,
                    COUNT(*) FILTER (WHERE compartment = 7) AS compartment7,
                    COUNT(*) FILTER (WHERE compartment = 8) AS compartment8
                FROM "card"
                WHERE box_id = $1;
                `;
    const stats = await pool.query(query, [boxId]);
    return stats.rows[0];
  } catch (error) {
    console.error('Error during instant stats retrieval:', error);
    throw error;
  }
}

async function getHistoricalStats(boxId) {
  console.log('getHistoricalStats boxId:', boxId);
}

module.exports = {
  getInstantStats,
  getHistoricalStats,
};
