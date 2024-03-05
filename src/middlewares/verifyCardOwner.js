const { getCardById } = require('../dataMappers/cardDataMapper');

// eslint-disable-next-line consistent-return
const verifyCardOwner = async (req, res, next) => {
  try {
    const userId = req.user;
    const cardId = parseInt(req.params.id, 10);
    if (Number.isNaN(cardId)) {
      return res.status(400).json([{ errCode: 56, errMessage: 'Invalid card id' }]);
    }
    const card = await getCardById(cardId);
    if (!card) {
      return res.status(403).json([{ errCode: 57, errMessage: 'Unauthorised users' }]);
    }
    if (card.creator_id !== userId) {
      return res.status(403).json([{ errCode: 58, errMessage: 'Unauthorised users' }]);
    }
    next();
  } catch (error) {
    console.error({ verifyCardOwnerError: error });
    return res.status(500).json([{ errCode: 59, errMessage: 'A server error occurred when verifying the card owner' }]);
  }
};

module.exports = verifyCardOwner;
