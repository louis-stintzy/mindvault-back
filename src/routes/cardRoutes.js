const { Router } = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const verifyBoxOwner = require('../middlewares/verifyBoxOwner');
const verifyCardOwner = require('../middlewares/verifyCardOwner');

const { getCards, createCard, updateCard, deleteCard } = require('../controllers/cardController');

const router = Router({ mergeParams: true }); // mergeParams: true allows us to access the boxId parameter from the parent router

router.get('/', authenticateToken, verifyBoxOwner, getCards);
router.post('/', authenticateToken, verifyBoxOwner, createCard);
router.put('/:cardId', authenticateToken, verifyBoxOwner, verifyCardOwner, updateCard);
router.delete('/:cardId', authenticateToken, verifyBoxOwner, verifyCardOwner, deleteCard);

module.exports = router;
