const validator = require('validator');
const boxDataMapper = require('../dataMappers/boxDataMapper');

// const getBoxById = async (id) => {
//   try {
//     const box = await boxDataMapper.getBoxById(id);
//     return box;
//   } catch (error) {
//     console.error({ getBoxByIdError: error });
//     throw error;
//   }
// };

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
    if (!name || typeof learnIt !== 'boolean' || !type) {
      return res.status(400).json([{ errCode: 33, errMessage: 'Missing required fields' }]);
    }
    if (type !== 1 && type !== 2 && type !== 3) {
      return res.status(400).json([{ errCode: 34, errMessage: 'Invalid box type' }]);
    }
    if (type === 1 || type === 3) {
      return res.status(400).json([{ errCode: 35, errMessage: 'Box type not yet implemented' }]);
    }
    // if (typeof learnIt !== 'boolean') {
    //   return res.status(400).json([{ errCode: 36, errMessage: 'Invalid learnIt value' }]);
    // }

    // Sanitize user inputs
    const sanitizedName = validator.escape(name);
    const sanitizedDescription = validator.escape(description);
    const sanitizedLabel = validator.escape(label);
    const sanitizedLevel = validator.escape(level);

    const createdBox = await boxDataMapper.createBox(
      userId,
      sanitizedName,
      sanitizedDescription,
      boxPicture,
      color,
      sanitizedLabel,
      sanitizedLevel,
      learnIt,
      type
    );
    return res.status(201).json(createdBox);
  } catch (error) {
    console.error({ createBoxError: error });
    return res.status(500).json([{ errCode: 32, errMessage: 'A server error occurred when creating the box' }]);
  }
};

// TODO Update Box
const updateBox = async () => {};

const updateBoxLearnItValue = async (req, res) => {
  try {
    const { boxId } = req.params;
    const { learnIt } = req.body;
    if (typeof learnIt !== 'boolean') {
      return res.status(400).json([{ errCode: 41, errMessage: 'Invalid learnIt value' }]);
    }
    const newState = await boxDataMapper.updateBoxLearnItValue(boxId, learnIt);
    return res.status(200).json(newState);
  } catch (error) {
    console.error({ updateBoxLearnItValueError: error });
    return res
      .status(500)
      .json([{ errCode: 42, errMessage: 'A server error occurred when updating "learn it" state' }]);
  }
};

const deleteBox = async (req, res) => {
  try {
    const { boxId } = req.params;
    await boxDataMapper.deleteBox(boxId);
    return res.status(204).end();
  } catch (error) {
    console.error({ deleteBoxError: error });
    return res.status(500).json([{ errCode: 40, errMessage: 'A server error occurred when deleting the box' }]);
  }
};

const boxController = {
  // getBoxById,
  getBoxes,
  createBox,
  updateBox,
  updateBoxLearnItValue,
  deleteBox,
};

module.exports = boxController;
