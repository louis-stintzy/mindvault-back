const { Router } = require('express');
const { checkLoginForm, checkRegistrationForm } = require('../middlewares/signInSignUpFormValidator');
const authenticateToken = require('../middlewares/authenticateToken');

const authController = require('../controllers/authController');

const router = Router();

router.post('/login', checkLoginForm, authController.login);
router.post('/register', checkRegistrationForm, authController.register);
router.get('/validateToken', authenticateToken, authController.validateToken);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
