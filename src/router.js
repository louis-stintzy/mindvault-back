const { Router } = require('express');
const { checkLoginForm, checkRegistrationForm } = require('./middlewares/signInSignUpFormValidator');
const authenticateToken = require('./middlewares/authenticateToken');
// const verifyBoxOwner = require('./middlewares/verifyBoxOwner');
// const verifyCardOwner = require('./middlewares/verifyCardOwner');
// const { upload, handleUploadError } = require('./middlewares/upload');
const authController = require('./controllers/authController');
// const boxController = require('./controllers/boxController');
// const cardController = require('./controllers/cardController');
// const playController = require('./controllers/playController');
// const statsController = require('./controllers/statsController');
const proxyController = require('./controllers/proxyController');

// const boxRoutes = require('./routes/boxRoutes');
const routes = require('./routes');

const router = Router();

router.get('/', (req, res) => {
  res.send('Welcome to the API. Please refer to the documentation for available endpoints.');
});

router.post('/user/login', checkLoginForm, authController.login);
router.post('/user/register', checkRegistrationForm, authController.register);
router.get('/user/validateToken', authenticateToken, authController.validateToken);

// todo : refaire la doc avec les nouveaux endpoints
router.use(routes); // note : router à déplacer par la suite dans index.js, pour l'instant il n'y a que des routes de box

// ------------------- BOXES -------------------

// ------------------- CARDS -------------------

// --------------------- PLAY ---------------------

// --------------------- STATS ---------------------

// --------------------- PROXY ---------------------
router.get('/proxy/images', authenticateToken, proxyController.searchUnsplashImages);
router.get('/proxy/image', authenticateToken, proxyController.getImageProxy);

module.exports = router;
