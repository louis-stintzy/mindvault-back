const { updateBoxLearnItValueDM } = require('../../dataMappers/boxDataMapper/index');

const updateBoxLearnItValue = async (req, res) => {
  try {
    const { boxId } = req.params;
    const { learnIt } = req.body;
    if (typeof learnIt !== 'boolean') {
      return res.status(400).json([{ errCode: 41, errMessage: 'Invalid learnIt value' }]);
    }
    const newState = await updateBoxLearnItValueDM(boxId, learnIt);
    return res.status(200).json(newState);
  } catch (error) {
    console.error({ updateBoxLearnItValueError: error });
    return res
      .status(500)
      .json([{ errCode: 42, errMessage: 'A server error occurred when updating "learn it" state' }]);
  }
};

module.exports = updateBoxLearnItValue;
