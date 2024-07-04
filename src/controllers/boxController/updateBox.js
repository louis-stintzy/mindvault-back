const { updateBoxDM } = require('../../dataMappers/boxDataMapper');
const { extractAndValidateBoxFields } = require('../../utils/extractAndValidateBoxFields');
const { generateSignedUrlAndSaveItToCache } = require('../../utils/generateSignedUrlAndSaveItToCache');

const ttl = 60 * 60 * 24; // 86400 = 24 hours

const updateBox = async (req, res) => {
  try {
    const { boxId } = req.params;
    const fields = extractAndValidateBoxFields(req);
    if (fields.error) {
      return res.status(400).json([fields.error]);
    }
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
      learnIt,
      type,
      photographerName,
      photographerProfileUrl,
    } = fields;

    let { pictureUrl } = fields;
    if (!pictureUrl && req.body.existingImageUrl) {
      // If no new image is uploaded, we keep the existing image
      pictureUrl = req.body.existingImageUrl;
    }

    const updatedBox = await updateBoxDM(boxId, {
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
    });
    // Generate signed URL for box picture and save it to cache
    if (updatedBox.picture && updatedBox.picture.pictureUrl) {
      // Replace the box_picture with a signed URL and save signed URL to cache (key: box:${boxId}:image)
      updatedBox.picture.pictureUrl = await generateSignedUrlAndSaveItToCache(
        { userOrBoxOrCard: 'box', id: updatedBox.id, infoType: 'picture' },
        updatedBox.picture.pictureUrl,
        ttl
      );
    } else {
      updatedBox.picture.pictureUrl = '';
    }
    return res.status(200).json(updatedBox);
  } catch (error) {
    console.error({ updateBoxError: error });
    return res.status(500).json([{ errCode: 132, errMessage: 'A server error occurred when updating the box' }]);
  }
};

module.exports = updateBox;
