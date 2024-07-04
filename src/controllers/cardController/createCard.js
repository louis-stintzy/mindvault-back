const { createCardDM } = require('../../dataMappers/cardDataMapper');

const createCard = async (req, res) => {
  try {
    const userId = req.user;
    const { boxId } = req.params;
    const { questionLanguage, questionVoice, answerLanguage, answerVoice, question, answer, attachment } = req.body;
    // rajouter questionVoice et answerVoice ? de toute facon, voix par defaut si pas de voix
    if (!questionLanguage || !answerLanguage || !question || !answer) {
      return res.status(400).json([{ errCode: 53, errMessage: 'Missing required fields' }]);
    }

    const createdCard = await createCardDM(
      boxId,
      userId,
      questionLanguage,
      questionVoice,
      answerLanguage,
      answerVoice,
      question,
      answer,
      attachment
    );
    return res.status(201).json(createdCard);
  } catch (error) {
    console.log({ createCardError: error });
    return res.status(500).json([{ errCode: 52, errMessage: 'A server error occurred when creating the card' }]);
  }
};

module.exports = createCard;
