const statsDataMapper = require('../dataMappers/statsDataMapper');

const getInstantStats = async (req, res) => {
  try {
    const { boxId } = req.params;
    const instantStats = await statsDataMapper.getInstantStats(boxId);
    return res.status(200).json(instantStats);
  } catch (error) {
    console.error({ getInstantStatsError: error });
    return res
      .status(500)
      .json([{ errCode: 111, errMessage: 'A server error occurred when retrieving instant stats' }]);
  }
};

const getHistoricalStats = async (req, res) => {
  try {
    const { boxId } = req.params;
    const historicalStats = await statsDataMapper.getHistoricalStats(boxId);
    return res.status(200).json(historicalStats);
  } catch (error) {
    console.error({ getHistoricalStatsError: error });
    return res
      .status(500)
      .json([{ errCode: 112, errMessage: 'A server error occurred when retrieving historical stats' }]);
  }
};

module.exports = {
  getInstantStats,
  getHistoricalStats,
};
