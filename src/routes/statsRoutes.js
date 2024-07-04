const { Router } = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const verifyBoxOwner = require('../middlewares/verifyBoxOwner');

const statsController = require('../controllers/statsController');

const router = Router({ mergeParams: true }); // mergeParams: true allows us to access the boxId parameter from the parent router

router.get('/instant', authenticateToken, verifyBoxOwner, statsController.getInstantStats);
router.get('/historical', authenticateToken, verifyBoxOwner, statsController.getHistoricalStats);

module.exports = router;
