const { Router } = require('express');
const authenticateToken = require('../middlewares/authenticateToken');

const proxyController = require('../controllers/proxyController');

const router = Router();

router.get('/images', authenticateToken, proxyController.searchUnsplashImages);
router.get('/image', authenticateToken, proxyController.getImageProxy);

module.exports = router;
