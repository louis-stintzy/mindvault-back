const { createBoxDM } = require('../../dataMappers/boxDataMapper/index');
const { extractAndValidateBoxFields } = require('../../utils/extractAndValidateBoxFields');
const { generateSignedUrlAndSaveItToCache } = require('../../utils/generateSignedUrlAndSaveItToCache');

const ttl = 60 * 60 * 24; // 86400 = 24 hours

const createBox = async (req, res) => {
  try {
    const fields = extractAndValidateBoxFields(req);
    if (fields.error) {
      return res.status(400).json([fields.error]);
    }

    const {
      userId,
      name,
      description,
      color,
      label,
      level,
      defaultQuestionLanguage,
      defaultQuestionVoice,
      defaultAnswerLanguage,
      defaultAnswerVoice,
      learnIt,
      type,
      pictureUrl,
      photographerName,
      photographerProfileUrl,
    } = fields;

    const createdBox = await createBoxDM(
      userId,
      name,
      description,
      color,
      label,
      level,
      defaultQuestionLanguage,
      defaultQuestionVoice,
      defaultAnswerLanguage,
      defaultAnswerVoice,
      learnIt,
      type,
      pictureUrl,
      photographerName,
      photographerProfileUrl
    );
    // Generate signed URL for box picture and save it to cache
    if (createdBox.picture && createdBox.picture.pictureUrl) {
      // Replace the box_picture with a signed URL and save signed URL to cache
      createdBox.picture.pictureUrl = await generateSignedUrlAndSaveItToCache(
        { userOrBoxOrCard: 'box', id: createdBox.id, infoType: 'picture' },
        createdBox.picture.pictureUrl,
        ttl
      );
    } else {
      createdBox.picture = {
        pictureUrl: '',
        photographerName: '',
        photographerProfileUrl: '',
      }; // renvoie cet objet plutôt que null pour éviter les erreurs côté client
    }

    return res.status(201).json(createdBox);
  } catch (error) {
    console.error({ createBoxError: error });
    return res.status(500).json([{ errCode: 32, errMessage: 'A server error occurred when creating the box' }]);
  }
};

module.exports = createBox;
