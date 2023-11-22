const { Router } = require('express');
const checkRegistrationForm = require('./middlewares/checkRegistrationForm');
const authController = require('./controllers/authController');

const router = Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
})

router.post('/api/login', authController.login);
router.post('/api/register', checkRegistrationForm, authController.register);

module.exports = router;