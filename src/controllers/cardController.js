const validator = require('validator');
const cardDataMapper = require('../dataMappers/cardDataMapper');

const getCards = async (req, res) => {
  try {
    const { boxId } = req.params;
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
    const { boxId } = req.params;
    const { question, answer, attachment } = req.body;
    if (!question || !answer) {
      return res.status(400).json([{ errCode: 53, errMessage: 'Missing required fields' }]);
    }

    // TODO Sanitize user inputs differement car supprime apostrophes et slashs
    const sanitizedQuestion = validator.escape(question);
    const sanitizedAnswer = validator.escape(answer);

    const createdCard = await cardDataMapper.createCard(boxId, userId, sanitizedQuestion, sanitizedAnswer, attachment);
    return res.status(201).json(createdCard);
  } catch (error) {
    console.log({ createCardError: error });
    return res.status(500).json([{ errCode: 52, errMessage: 'A server error occurred when creating the card' }]);
  }
};

// TODO Update Card
const updateCard = async () => {};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    await cardDataMapper.deleteCard(cardId);
    return res.status(204).end();
  } catch (error) {
    console.error({ deleteCardError: error });
    return res.status(500).json([{ errCode: 55, errMessage: 'A server error occurred when deleting the card' }]);
  }
};

const cardController = {
  getCards,
  createCard,
  updateCard,
  deleteCard,
};

module.exports = cardController;
