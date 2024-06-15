const { generateSignedUrl } = require('./signedUrl');
const { setToCache } = require('./cache');

const generateSignedUrlAndSaveItToCache = async (belongsToAndFileType, s3Url, ttl) => {
  if (!belongsToAndFileType || !s3Url || !ttl) {
    console.error('generateSignedUrlAndSaveItToCache: Missing parameters');
    throw new Error('generateSignedUrlAndSaveItToCache: Missing parameters');
  }

  try {
    const { boxOrCard, id, infoType } = belongsToAndFileType;
    const s3ObjectKey = s3Url.split('/').pop(); // la clé de l'objet dans S3 (en fait, le nom du fichier présent dans l'URL)
    // (aurait pu être ici req.file.key, je garde une cohérence avec le code dans getBoxes)
    const signedUrl = await generateSignedUrl(s3ObjectKey, ttl);
    const cacheKey = `${boxOrCard}:${id}:${infoType}`;
    await setToCache(cacheKey, signedUrl, ttl);
    // TEST CACHE
    // const cachedValue = await getFromCache(cacheKey);
    // console.log('cachedValue:', cachedValue);
    return signedUrl; // retourne l'url signée pour remplacement dans l'objet box ou card (à la place de l'url S3, non signée)
  } catch (error) {
    console.error('generateSignedUrlAndSaveItToCache: Error generating signed URL and caching it', error);
    throw new Error('generateSignedUrlAndSaveItToCache: ', error);
  }
};

module.exports = { generateSignedUrlAndSaveItToCache };
