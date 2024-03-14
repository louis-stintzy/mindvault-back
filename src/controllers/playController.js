const validator = require('validator');
const playDataMapper = require('../dataMappers/playDataMapper');

const getRandomCards = async (req, res) => {
  try {
    const { boxId } = req.params;
    const cards = await playDataMapper.playBox(boxId);
    return res.status(200).json(cards);
  } catch (error) {
    console.error({ playBoxError: error });
    return res.status(500).json([{ errCode: 101, errMessage: 'A server error occurred when retrieving cards' }]);
  }
};

const updateCardAttributes = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { nextDateToAsk, nextCompartment } = req.body;
    if (!nextDateToAsk || !nextCompartment) {
      return res.status(400).json([{ errCode: 103, errMessage: 'Missing required fields' }]);
    }
    if (!validator.isDate(nextDateToAsk)) {
      return res.status(400).json([{ errCode: 104, errMessage: 'Invalid date format' }]);
    }
    if (Number.isNaN(parseInt(nextCompartment, 10))) {
      return res.status(400).json([{ errCode: 105, errMessage: 'Invalid compartment format' }]);
    }
    // TODO : Vérifier que nextCompartment soit bien un compartiment valide (à définir : 1 à 7 ?)
    // if (nextCompartment < 1 || nextCompartment > 7) {
    //   return res.status(400).json([{ errCode: 106, errMessage: 'Invalid compartment number }]);
    // }
    const updatedCard = await playDataMapper.updateCardAttributes(cardId, nextDateToAsk, nextCompartment);
    return res.status(200).json(updatedCard);
  } catch (error) {
    console.error({ updateCardAttributesError: error });
    return res
      .status(500)
      .json([{ errCode: 102, errMessage: 'A server error occurred when updating the card attributes' }]);
  }
};

module.exports = {
  getRandomCards,
  updateCardAttributes,
};
