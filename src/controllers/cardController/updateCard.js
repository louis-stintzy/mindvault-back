const { updateCardDM } = require('../../dataMappers/cardDataMapper');

// todo : Update Card (Controller)
const updateCard = async () => {
  console.log('Card Controller : todo Update Card');
  await updateCardDM();
};

module.exports = updateCard;
