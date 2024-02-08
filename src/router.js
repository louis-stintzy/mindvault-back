const { Router } = require('express');
const { checkLoginForm, checkRegistrationForm } = require('./middlewares/signInSignUpFormValidator');
const authenticateToken = require('./middlewares/authenticateToken');
const authController = require('./controllers/authController');
const boxController = require('./controllers/boxController');

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/api/user/login', checkLoginForm, authController.login);
router.post('/api/user/register', checkRegistrationForm, authController.register);
router.get('/api/user/validateToken', authenticateToken, authController.validateToken);

router.get('/api/box/getBoxes/', authenticateToken, boxController.getBoxes);
router.post('/api/box/createBox/', authenticateToken, boxController.createBox);

module.exports = router;
