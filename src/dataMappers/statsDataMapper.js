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
    const result = await pool.query(query, [boxId]);
    const stats = result.rows[0];
    const cardsByCompartment = {
      compartment1: stats.compartment1,
      compartment2: stats.compartment2,
      compartment3: stats.compartment3,
      compartment4: stats.compartment4,
      compartment5: stats.compartment5,
      compartment6: stats.compartment6,
      compartment7: stats.compartment7,
      compartment8: stats.compartment8,
    };
    return {
      totalCards: stats.totalcards,
      cardsByCompartment,
    };
  } catch (error) {
    console.error('Error during instant stats retrieval:', error);
    throw error;
  }
}

async function getHistoricalStats(boxId) {
  try {
    const query = `
    SELECT * from "box_historical_stats"
    WHERE box_id = $1
    ORDER BY created_at ASC;
    `;
    const result = await pool.query(query, [boxId]);

    const historicalStatsArray = result.rows.map((stats) => {
      const date = new Date(stats.created_at);
      const formatedDate = date.toISOString().split('T')[0];
      return {
        totalCards: stats.total_cards,
        cardsByCompartment: {
          compartment1: stats.compartment1,
          compartment2: stats.compartment2,
          compartment3: stats.compartment3,
          compartment4: stats.compartment4,
          compartment5: stats.compartment5,
          compartment6: stats.compartment6,
          compartment7: stats.compartment7,
          compartment8: stats.compartment8,
        },
        statsDate: {
          statisticsDay: formatedDate,
          weekNumber: stats.week_number,
          year: stats.year,
        },
      };
    });

    return historicalStatsArray;
  } catch (error) {
    console.error('Error during historical stats retrieval:', error);
    throw error;
  }
}

module.exports = {
  getInstantStats,
  getHistoricalStats,
};
