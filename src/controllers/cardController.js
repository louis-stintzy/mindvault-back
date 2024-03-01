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

const createCard = async (req, res) => {
  try {
    const userId = req.user;
    const boxId = req.params.id;
    const { question, answer, attachment } = req.body;
    if (!question || !answer) {
      return res.status(400).json([{ errCode: 53, errMessage: 'Missing required fields' }]);
    }
    const createdCard = await cardDataMapper.createCard(boxId, userId, question, answer, attachment);
    return res.status(201).json(createdCard);
  } catch (error) {
    console.log({ createCardError: error });
    return res.status(500).json([{ errCode: 52, errMessage: 'A server error occurred when creating the card' }]);
  }
};

const cardController = {
  getCards,
  createCard,
};

module.exports = cardController;
