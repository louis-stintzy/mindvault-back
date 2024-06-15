const extractAndValidateBoxFields = (req) => {
  // Dans le middleware authenticateToken, on a ajouté les infos utilisateur à l'objet req
  const userId = req.user;
  // Dans le middleware upload, multer a placé le fichier dans req.file
  const boxPicturePath = req.file ? req.file.location : null;
  const {
    name,
    description,
    color,
    label,
    level,
    defaultQuestionLanguage,
    defaultQuestionVoice,
    defaultAnswerLanguage,
    defaultAnswerVoice,
  } = req.body;
  // En multipart/form-data, les valeurs des champs sont des strings
  let { learnIt } = req.body;
  if (learnIt === 'true') learnIt = true;
  if (learnIt === 'false') learnIt = false;
  let { type } = req.body;
  if (type === '1') type = 1;
  if (type === '2') type = 2;
  if (type === '3') type = 3;
  if (!name || typeof learnIt !== 'boolean' || !type) {
    return { error: { errCode: 33, errMessage: 'Missing required fields' } };
  }
  if (type !== 1 && type !== 2 && type !== 3) {
    return { error: { errCode: 34, errMessage: 'Invalid box type' } };
  }
  if (type === 1 || type === 3) {
    return { error: { errCode: 35, errMessage: 'Box type not yet implemented' } };
  }
  // todo : Vérifier que les langues par défaut sont bien dans la liste des langues autorisées

  return {
    userId,
    name,
    description,
    boxPicturePath,
    color,
    label,
    level,
    defaultQuestionLanguage,
    defaultQuestionVoice,
    defaultAnswerLanguage,
    defaultAnswerVoice,
    learnIt,
    type,
  };
};

module.exports = extractAndValidateBoxFields;
