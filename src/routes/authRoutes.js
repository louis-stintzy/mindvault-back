const { Router } = require('express');
const { checkLoginForm, checkRegistrationForm } = require('../middlewares/signInSignUpFormValidator');
const authenticateToken = require('../middlewares/authenticateToken');

const { login, register, validateToken, logout } = require('../controllers/authController');

const router = Router();

router.post('/login', checkLoginForm, login);
router.post('/register', checkRegistrationForm, register);
router.get('/validateToken', authenticateToken, validateToken);
router.post('/logout', authenticateToken, logout);

module.exports = router;
