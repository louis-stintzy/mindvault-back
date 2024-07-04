const { deleteBoxDM } = require('../../dataMappers/boxDataMapper');

const deleteBox = async (req, res) => {
  try {
    const { boxId } = req.params;
    await deleteBoxDM(boxId);
    return res.status(204).end();
  } catch (error) {
    console.error({ deleteBoxError: error });
    return res.status(500).json([{ errCode: 40, errMessage: 'A server error occurred when deleting the box' }]);
  }
};

module.exports = deleteBox;
