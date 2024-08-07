const { Router } = require('express');
const { checkLoginForm, checkRegistrationForm } = require('./middlewares/signInSignUpFormValidator');
const authenticateToken = require('./middlewares/authenticateToken');
const verifyBoxOwner = require('./middlewares/verifyBoxOwner');
const verifyCardOwner = require('./middlewares/verifyCardOwner');
// const { upload, handleUploadError } = require('./middlewares/upload');
const authController = require('./controllers/authController');
// const boxController = require('./controllers/boxController');
const cardController = require('./controllers/cardController');
const playController = require('./controllers/playController');
const statsController = require('./controllers/statsController');
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

// ------------------- BOXES -------------------
// router.use('/box', boxRoutes);
router.use(routes); // note : router à déplacer par la suite dans index.js, pour l'instant il n'y a que des routes de box

// router.get('/box/:boxId', authenticateToken, verifyBoxOwner, boxController.getBoxById);
// router.get('/boxes/', authenticateToken, boxController.getBoxes);
// // utiliser sharp ?
// router.post('/boxes/', authenticateToken, upload.single('image'), handleUploadError, boxController.createBox);

// router.put(
//   '/box/:boxId',
//   authenticateToken,
//   verifyBoxOwner,
//   upload.single('image'),
//   handleUploadError,
//   boxController.updateBox
// );

// router.patch('/box/:boxId/learnit', authenticateToken, verifyBoxOwner, boxController.updateBoxLearnItValue);
// router.delete('/box/:boxId', authenticateToken, verifyBoxOwner, boxController.deleteBox);

// ------------------- CARDS -------------------
router.get('/box/:boxId/cards', authenticateToken, verifyBoxOwner, cardController.getCards);
router.post('/box/:boxId/cards/', authenticateToken, verifyBoxOwner, cardController.createCard);
router.put('/box/:boxId/card/:cardId', authenticateToken, verifyBoxOwner, verifyCardOwner, cardController.updateCard);
router.delete(
  '/box/:boxId/card/:cardId',
  authenticateToken,
  verifyBoxOwner,
  verifyCardOwner,
  cardController.deleteCard
);

// --------------------- PLAY ---------------------
router.get('/play/box/:boxId', authenticateToken, verifyBoxOwner, playController.getRandomCards);
router.patch('/play/card/:cardId', authenticateToken, verifyCardOwner, playController.updateCardAttributes);

// --------------------- STATS ---------------------
router.get('/stats/instant/box/:boxId', authenticateToken, verifyBoxOwner, statsController.getInstantStats);
router.get('/stats/historical/box/:boxId', authenticateToken, verifyBoxOwner, statsController.getHistoricalStats);

// --------------------- PROXY ---------------------
router.get('/proxy/images', authenticateToken, proxyController.searchUnsplashImages);
router.get('/proxy/image', authenticateToken, proxyController.getImageProxy);

module.exports = router;
