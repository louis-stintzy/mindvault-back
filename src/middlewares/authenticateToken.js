const jwt = require('jsonwebtoken');

// TODO: vérifier que le token envoyé n'est pas blacklisté

// eslint-disable-next-line consistent-return
const authenticateToken = (req, res, next) => {
  // Récupère la valeur du header Authorization de la requête HTTP
  // Le format attendu du header Authorization est généralement "Bearer TOKEN_HERE",
  const authHeader = req.headers.authorization;
  // On utilise donc la méthode split pour récupérer le token
  const token = authHeader && authHeader.split(' ')[1];

  // Si le token est vide, on renvoie une erreur 401
  if (!token) {
    return res.status(401).json([{ errCode: 21, errMessage: 'Missing token' }]);
  }

  // Vérification de la Validité du Token
  // eslint-disable-next-line consistent-return
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    // Si le token est invalide, on renvoie une erreur 403
    if (err) {
      return res.status(403).json([{ errCode: 22, errMessage: 'Bad token' }]);
    }
    // Si le token est valide, on ajoute les infos utilisateur à l'objet req pour un usage ultérieur
    req.user = user;
    // Passer au prochain middleware ou contrôleur
    next();
  });
};

module.exports = authenticateToken;
