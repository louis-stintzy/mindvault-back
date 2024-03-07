const { Router } = require('express');
const { checkLoginForm, checkRegistrationForm } = require('./middlewares/signInSignUpFormValidator');
const authenticateToken = require('./middlewares/authenticateToken');
const authController = require('./controllers/authController');
const boxController = require('./controllers/boxController');
const cardController = require('./controllers/cardController');
const verifyBoxOwner = require('./middlewares/verifyBoxOwner');
const verifyCardOwner = require('./middlewares/verifyCardOwner');

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/api/user/login', checkLoginForm, authController.login);
router.post('/api/user/register', checkRegistrationForm, authController.register);
router.get('/api/user/validateToken', authenticateToken, authController.validateToken);

// ------------------- BOXES -------------------
router.get('/api/boxes/', authenticateToken, boxController.getBoxes);
router.post('/api/boxes/', authenticateToken, boxController.createBox);
router.put('/api/box/:boxId', authenticateToken, verifyBoxOwner, boxController.updateBox);
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

module.exports = router;
