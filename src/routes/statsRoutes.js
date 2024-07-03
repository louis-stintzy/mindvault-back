const { Router } = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const verifyBoxOwner = require('../middlewares/verifyBoxOwner');

const statsController = require('../controllers/statsController');

const router = Router();

router.get('/instant', authenticateToken, verifyBoxOwner, statsController.getInstantStats);
router.get('/historical', authenticateToken, verifyBoxOwner, statsController.getHistoricalStats);

module.exports = router;
