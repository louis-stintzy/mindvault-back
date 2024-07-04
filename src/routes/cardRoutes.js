const { Router } = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const verifyBoxOwner = require('../middlewares/verifyBoxOwner');
const verifyCardOwner = require('../middlewares/verifyCardOwner');

const cardController = require('../controllers/cardController');

const router = Router({ mergeParams: true }); // mergeParams: true allows us to access the boxId parameter from the parent router

router.get('/', authenticateToken, verifyBoxOwner, cardController.getCards);
router.post('/', authenticateToken, verifyBoxOwner, cardController.createCard);
router.put('/:cardId', authenticateToken, verifyBoxOwner, verifyCardOwner, cardController.updateCard);
router.delete('/:cardId', authenticateToken, verifyBoxOwner, verifyCardOwner, cardController.deleteCard);

module.exports = router;
