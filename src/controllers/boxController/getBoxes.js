const { getBoxesDM } = require('../../dataMappers/boxDataMapper/index');
const { getFromCache, setToCache } = require('../../utils/cache');
const { generateSignedUrl } = require('../../utils/signedUrl');

const ttl = 60 * 60 * 24; // 86400 = 24 hours

const getBoxes = async (req, res) => {
  try {
    // Dans le middleware authenticateToken, on a ajouté les infos utilisateur à l'objet req
    const userId = req.user;
    const boxes = await getBoxesDM(userId);

    // Si il y a des boxes, on va vérifier pour chacune d'elles si elles ont une image.
    // Si oui : on vérifie si un lien signé est présent en cache :
    // +++ si oui, c'est bien on la récupère ; +++ si non, on génère un lien signé, on le sauvegarde en cache, on le renvoie avec sa box
    // Si non : on ne touche pas, on renvoie la box telle quelle avec box_picture = null
    // Pour des opérations asynchrone sur réalisé sur un objet itérable, on va utiliser Promise.all()

    if (boxes.length > 0) {
      // console.log('----- Il y a des boxes, je vais vérifier si elles ont une image -----');
      const boxPromises = boxes.map(async (box) => {
        // console.log(box.name, " : je travaille dans cette box et vérifie la présence d'une image");
        if (box.picture && box.picture.pictureUrl) {
          const s3Url = box.picture.pictureUrl;
          const s3ObjectKey = s3Url.split('/').pop(); // la clé de l'objet dans S3 (en fait, le nom du fichier présent dans l'URL)
          // console.log(box.name, " : Oui, il y a une image, je vérifie dans redis si l'url signée est en cache");
          const cacheKey = `box:${box.id}:picture`;
          const cachedUrl = await getFromCache(cacheKey);
          if (cachedUrl) {
            // console.log(box.name, ' : Oui, elle y est, cachedUrl est renseignée et la box est renvoyée');
            return {
              ...box,
              picture: {
                pictureUrl: cachedUrl,
                photographerName: box.picture.photographerName,
                photographerProfileUrl: box.picture.photographerProfileUrl,
              },
            };
          }
          // console.log(
          //   box.name,
          //   " : Non, elle n'y est pas, je génère un lien signé, je le sauvegarde en cache, je le renvoie avec sa box"
          // );
          const signedUrl = await generateSignedUrl(s3ObjectKey, ttl);
          await setToCache(cacheKey, signedUrl, ttl);
          return {
            ...box,
            picture: {
              pictureUrl: signedUrl,
              photographerName: box.picture.photographerName,
              photographerProfileUrl: box.picture.photographerProfileUrl,
            },
          };
        }
        // console.log(box.name, " : Non, il n'y a pas d'image, je renvoie la box telle quelle avec picture_url = null");
        return {
          ...box,
          picture: {
            pictureUrl: '',
            photographerName: '',
            photographerProfileUrl: '',
          }, // renvoie cet objet plutôt que null pour éviter les erreurs côté client };
        };
      });
      const boxesWithSignedUrls = await Promise.all(boxPromises);
      // Si boxes : on renvoie les boxes avec les liens signés
      return res.status(200).json(boxesWithSignedUrls);
    }
    // Si pas de boxes : on renvoie un tableau vide
    return res.status(200).json([]);
  } catch (error) {
    console.error({ getBoxesError: error });
    return res.status(500).json([{ errCode: 31, errMessage: 'A server error occurred when retrieving the boxes' }]);
  }
};

module.exports = getBoxes;
