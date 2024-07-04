const { getCardsDM } = require('../../dataMappers/cardDataMapper');

const getCards = async (req, res) => {
  try {
    const { boxId } = req.params;
    const cards = await getCardsDM(boxId);
    return res.status(200).json(cards);
  } catch (error) {
    console.error({ getCardsError: error });
    return res.status(500).json([{ errCode: 51, errMessage: 'A server error occurred when retrieving the cards' }]);
  }
};

module.exports = getCards;
