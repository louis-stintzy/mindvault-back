const { getBoxById } = require('../dataMappers/boxDataMapper');

// eslint-disable-next-line consistent-return
const verifyBoxOwner = async (req, res, next) => {
  try {
    const userId = req.user;
    const boxId = req.params.id;
    const box = await getBoxById(boxId);

    // Vérifier que la box soit bien possédée par l'utilisateur
    // Si pas de box : Retourner normalement une erreur 404
    // mais ici retourner 403 pour ne pas donner d'informations sur l'existence ou non de la box
    // seul le code erreur diffère
    if (!box) {
      return res.status(403).json([{ errCode: 37, errMessage: 'Unauthorised users' }]);
    }
    // Si non : Retourner une erreur 403
    if (box.owner_id !== userId) {
      return res.status(403).json([{ errCode: 38, errMessage: 'Unauthorised users' }]);
    }

    // Si oui : next
    next();
  } catch (error) {
    console.error({ verifyBoxOwnerError: error });
    return res.status(500).json([{ errCode: 36, errMessage: 'A server error occurred when verifying the box owner' }]);
  }
};

module.exports = verifyBoxOwner;
