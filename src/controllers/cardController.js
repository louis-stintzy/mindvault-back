const cardDataMapper = require('../dataMappers/cardDataMapper');

const getCards = async (req, res) => {
  try {
    const boxId = req.params.id;
    const cards = await cardDataMapper.getCards(boxId);
    return res.status(200).json(cards);
  } catch (error) {
    console.error({ getCardsError: error });
    return res.status(500).json([{ errCode: 51, errMessage: 'A server error occurred when retrieving the cards' }]);
  }
};

const createCard = async (req, res) => {};

const cardController = {
  getCards,
  createCard,
};

module.exports = cardController;
