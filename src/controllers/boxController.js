// const validator = require('validator');
const boxDataMapper = require('../dataMappers/boxDataMapper');
const { extractAndValidateBoxFields } = require('../utils/extractAndValidateBoxFields');
const { generateSignedUrl } = require('../utils/signedUrl');
const { getFromCache, setToCache } = require('../utils/cache');
const { generateSignedUrlAndSaveItToCache } = require('../utils/generateSignedUrlAndSaveItToCache');

const ttl = 60 * 60 * 24; // 24 hours

// ----- getBoxById -----
// TODO : faire la doc endpoint et code erreur
const getBoxById = async (req, res) => {
  try {
    const { boxId } = req.params;
    const box = await boxDataMapper.getBoxById(boxId);
    return res.status(200).json(box);
  } catch (error) {
    console.error({ getBoxByIdError: error });
    return res.status(500).json([{ errCode: 30, errMessage: 'A server error occurred when retrieving the box' }]);
  }
};

// ----- getBoxes -----
const getBoxes = async (req, res) => {
  try {
    // Dans le middleware authenticateToken, on a ajouté les infos utilisateur à l'objet req
    const userId = req.user;
    const boxes = await boxDataMapper.getBoxes(userId);

    // Si il y a des boxes, on va vérifier pour chacune d'elles si elles ont une image.
    // Si oui : on vérifie si un lien signé est présent en cache :
    // +++ si oui, c'est bien on la récupère ; +++ si non, on génère un lien signé, on le sauvegarde en cache, on le renvoie avec sa box
    // Si non : on ne touche pas, on renvoie la box telle quelle avec box_picture = null
    // Pour des opérations asynchrone sur réalisé sur un objet itérable, on va utiliser Promise.all()

    if (boxes.length > 0) {
      // console.log('----- Il y a des boxes, je vais vérifier si elles ont une image -----');
      const boxPromises = boxes.map(async (box) => {
        // console.log(box.name, " : je travaille dans cette box et vérifie la présence d'une image");
        if (box.box_picture) {
          const s3Url = box.box_picture;
          const s3ObjectKey = s3Url.split('/').pop(); // la clé de l'objet dans S3 (en fait, le nom du fichier présent dans l'URL)
          // console.log(box.name, " : Oui, il y a une image, je vérifie dans redis si l'url signée est en cache");
          const cacheKey = `box:${box.id}:imageUrl`;
          const cachedUrl = await getFromCache(cacheKey);
          if (cachedUrl) {
            // console.log(box.name, ' : Oui, elle y est, cachedUrl est renseignée et la box est renvoyée');
            return { ...box, box_picture: cachedUrl };
          }
          // console.log(
          //   box.name,
          //   " : Non, elle n'y est pas, je génère un lien signé, je le sauvegarde en cache, je le renvoie avec sa box"
          // );
          const signedUrl = await generateSignedUrl(s3ObjectKey, ttl);
          await setToCache(cacheKey, signedUrl, ttl);
          return { ...box, box_picture: signedUrl };
        }
        // console.log(box.name, " : Non, il n'y a pas d'image, je renvoie la box telle quelle avec box_picture = null");
        return { ...box, box_picture: null };
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

// ----- createBox -----
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
    } = fields;

    const createdBox = await boxDataMapper.createBox(
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
      type
    );
    // Generate signed URL for box picture and save it to cache
    if (createdBox.box_picture) {
      // Replace the box_picture with a signed URL and save signed URL to cache
      createdBox.box_picture = await generateSignedUrlAndSaveItToCache(
        { boxOrCard: 'box', id: createdBox.id, infoType: 'image' },
        createdBox.box_picture,
        ttl
      );
    } else {
      createdBox.box_picture = null;
    }

    return res.status(201).json(createdBox);
  } catch (error) {
    console.error({ createBoxError: error });
    return res.status(500).json([{ errCode: 32, errMessage: 'A server error occurred when creating the box' }]);
  }
};

// ----- updateBox -----
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
    } = fields;

    const updatedBox = await boxDataMapper.updateBox(boxId, {
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
    });
    // Generate signed URL for box picture and save it to cache
    if (updatedBox.box_picture) {
      // Replace the box_picture with a signed URL and save signed URL to cache (key: box:${boxId}:image)
      updatedBox.box_picture = await generateSignedUrlAndSaveItToCache(
        { boxOrCard: 'box', id: updatedBox.id, infoType: 'image' },
        updatedBox.box_picture,
        ttl
      );
    } else {
      updatedBox.box_picture = null;
    }
    return res.status(200).json(updatedBox);
  } catch (error) {
    console.error({ updateBoxError: error });
    return res.status(500).json([{ errCode: 132, errMessage: 'A server error occurred when updating the box' }]);
  }
};

// ----- updateBoxLearnItValue -----
const updateBoxLearnItValue = async (req, res) => {
  try {
    const { boxId } = req.params;
    const { learnIt } = req.body;
    if (typeof learnIt !== 'boolean') {
      return res.status(400).json([{ errCode: 41, errMessage: 'Invalid learnIt value' }]);
    }
    const newState = await boxDataMapper.updateBoxLearnItValue(boxId, learnIt);
    return res.status(200).json(newState);
  } catch (error) {
    console.error({ updateBoxLearnItValueError: error });
    return res
      .status(500)
      .json([{ errCode: 42, errMessage: 'A server error occurred when updating "learn it" state' }]);
  }
};

// ----- deleteBox -----
const deleteBox = async (req, res) => {
  try {
    const { boxId } = req.params;
    await boxDataMapper.deleteBox(boxId);
    return res.status(204).end();
  } catch (error) {
    console.error({ deleteBoxError: error });
    return res.status(500).json([{ errCode: 40, errMessage: 'A server error occurred when deleting the box' }]);
  }
};

const boxController = {
  getBoxById,
  getBoxes,
  createBox,
  updateBox,
  updateBoxLearnItValue,
  deleteBox,
};

module.exports = boxController;
