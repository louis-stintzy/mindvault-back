const boxDataMapper = require('../dataMappers/boxDataMapper');

const getBoxes = async (req, res) => {
  try {
    // Dans le middleware authenticateToken, on a ajouté les infos utilisateur à l'objet req
    const userId = req.user;
    const boxes = await boxDataMapper.getBoxes(userId);
    return res.status(200).json(boxes);
  } catch (error) {
    console.error({ getBoxesError: error });
    return res.status(500).json([{ errCode: 31, errMessage: 'A server error occurred when retrieving the boxes' }]);
  }
};

const createBox = async (req, res) => {
  try {
    // Dans le middleware authenticateToken, on a ajouté les infos utilisateur à l'objet req
    const userId = req.user;
    const { name, description, boxPicture, color, label, level, learnIt, type } = req.body;
    if (!name || !learnIt || !type) {
      return res.status(400).json([{ errCode: 33, errMessage: 'Missing required fields' }]);
    }
    if (type !== 1 && type !== 2 && type !== 3) {
      return res.status(400).json([{ errCode: 34, errMessage: 'Invalid box type' }]);
    }
    if (type === 1 || type === 3) {
      return res.status(400).json([{ errCode: 35, errMessage: 'Box type not yet implemented' }]);
    }
    if (typeof learnIt !== 'boolean') {
      return res.status(400).json([{ errCode: 36, errMessage: 'Invalid learnIt value' }]);
    }
    const createdBox = await boxDataMapper.createBox(
      userId,
      name,
      description,
      boxPicture,
      color,
      label,
      level,
      learnIt,
      type
    );
    return res.status(201).json(createdBox);
  } catch (error) {
    console.error({ createBoxError: error });
    return res.status(500).json([{ errCode: 32, errMessage: 'A server error occurred when creating the box' }]);
  }
};

const boxController = {
  getBoxes,
  createBox,
};

module.exports = boxController;
