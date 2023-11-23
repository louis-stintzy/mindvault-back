const { Router } = require('express');
const { checkLoginForm, checkRegistrationForm } = require('./middlewares/signInSignUpFormValidator');
const authController = require('./controllers/authController');

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/api/user/login', checkLoginForm, authController.login);
router.post('/api/user/register', checkRegistrationForm, authController.register);

module.exports = router;
