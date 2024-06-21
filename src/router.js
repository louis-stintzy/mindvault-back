const { Router } = require('express');
const { checkLoginForm, checkRegistrationForm } = require('./middlewares/signInSignUpFormValidator');
const authenticateToken = require('./middlewares/authenticateToken');
const verifyBoxOwner = require('./middlewares/verifyBoxOwner');
const verifyCardOwner = require('./middlewares/verifyCardOwner');
const { upload, handleUploadError } = require('./middlewares/upload');
const authController = require('./controllers/authController');
const boxController = require('./controllers/boxController');
const cardController = require('./controllers/cardController');
const playController = require('./controllers/playController');
const statsController = require('./controllers/statsController');
const proxyController = require('./controllers/proxyController');

const router = Router();

router.get('/', (req, res) => {
  res.send('Welcome to the API. Please refer to the documentation for available endpoints.');
});

router.post('/api/user/login', checkLoginForm, authController.login);
router.post('/api/user/register', checkRegistrationForm, authController.register);
router.get('/api/user/validateToken', authenticateToken, authController.validateToken);

// ------------------- BOXES -------------------
router.get('/api/box/:boxId', authenticateToken, verifyBoxOwner, boxController.getBoxById);
router.get('/api/boxes/', authenticateToken, boxController.getBoxes);
// utiliser sharp ?
router.post('/api/boxes/', authenticateToken, upload.single('image'), handleUploadError, boxController.createBox);

router.put(
  '/api/box/:boxId',
  authenticateToken,
  verifyBoxOwner,
  upload.single('image'),
  handleUploadError,
  boxController.updateBox
);

router.patch('/api/box/:boxId/learnit', authenticateToken, verifyBoxOwner, boxController.updateBoxLearnItValue);
router.delete('/api/box/:boxId', authenticateToken, verifyBoxOwner, boxController.deleteBox);

// ------------------- CARDS -------------------
router.get('/api/box/:boxId/cards', authenticateToken, verifyBoxOwner, cardController.getCards);
router.post('/api/box/:boxId/cards/', authenticateToken, verifyBoxOwner, cardController.createCard);
router.put(
  '/api/box/:boxId/card/:cardId',
  authenticateToken,
  verifyBoxOwner,
  verifyCardOwner,
  cardController.updateCard
);
router.delete(
  '/api/box/:boxId/card/:cardId',
  authenticateToken,
  verifyBoxOwner,
  verifyCardOwner,
  cardController.deleteCard
);

// --------------------- PLAY ---------------------
router.get('/api/play/box/:boxId', authenticateToken, verifyBoxOwner, playController.getRandomCards);
router.patch('/api/play/card/:cardId', authenticateToken, verifyCardOwner, playController.updateCardAttributes);

// --------------------- STATS ---------------------
router.get('/api/stats/instant/box/:boxId', authenticateToken, verifyBoxOwner, statsController.getInstantStats);
router.get('/api/stats/historical/box/:boxId', authenticateToken, verifyBoxOwner, statsController.getHistoricalStats);

// --------------------- PROXY ---------------------
router.get('/api/proxy/images', authenticateToken, proxyController.searchUnsplashImages);
router.get('/api/proxy/image', authenticateToken, proxyController.getImageProxy);

module.exports = router;
