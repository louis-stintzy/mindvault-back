const { Router } = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const verifyBoxOwner = require('../middlewares/verifyBoxOwner');
const verifyCardOwner = require('../middlewares/verifyCardOwner');

const playController = require('../controllers/playController');

const router = Router();

router.get('/', authenticateToken, verifyBoxOwner, playController.getRandomCards);
router.patch('/cards/:cardId', authenticateToken, verifyCardOwner, playController.updateCardAttributes);

module.exports = router;
