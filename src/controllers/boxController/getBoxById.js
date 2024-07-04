const { getBoxByIdDM } = require('../../dataMappers/boxDataMapper');
const { getFromCache, setToCache } = require('../../utils/cache');
const { generateSignedUrl } = require('../../utils/signedUrl');

const ttl = 60 * 60 * 24; // 86400 = 24 hours

// Note: voir commentaires dans getBoxes
// Todo : faire la doc endpoint et code erreur

const getBoxById = async (req, res) => {
  try {
    const { boxId } = req.params;
    const box = await getBoxByIdDM(boxId);
    if (!box) {
      return res.status(404).json([{ errCode: 29, errMessage: 'Box not found' }]);
    }
    if (box.picture && box.picture.pictureUrl) {
      const s3Url = box.picture.pictureUrl;
      const s3ObjectKey = s3Url.split('/').pop();
      const cacheKey = `box:${box.id}:picture`;
      const cachedUrl = await getFromCache(cacheKey);
      if (cachedUrl) {
        box.picture.pictureUrl = cachedUrl;
      } else {
        const signedUrl = await generateSignedUrl(s3ObjectKey, ttl);
        await setToCache(cacheKey, signedUrl, ttl);
        box.picture.pictureUrl = signedUrl;
      }
    } else {
      box.picture = {
        pictureUrl: '',
        photographerName: '',
        photographerProfileUrl: '',
      }; // renvoie cet objet plutôt que null pour éviter les erreurs côté client
    }
    return res.status(200).json(box);
  } catch (error) {
    console.error({ getBoxByIdError: error });
    return res.status(500).json([{ errCode: 30, errMessage: 'A server error occurred when retrieving the box' }]);
  }
};

module.exports = getBoxById;
