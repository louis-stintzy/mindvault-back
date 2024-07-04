const { deleteCardDM } = require('../../dataMappers/cardDataMapper');

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    await deleteCardDM(cardId);
    return res.status(204).end();
  } catch (error) {
    console.error({ deleteCardError: error });
    return res.status(500).json([{ errCode: 55, errMessage: 'A server error occurred when deleting the card' }]);
  }
};

module.exports = deleteCard;
