const { Router } = require('express');
const boxRoutes = require('./boxRoutes');
const cardRoutes = require('./cardRoutes');
const playRoutes = require('./playRoutes');
const statsRoutes = require('./statsRoutes');

const router = Router();

router.use('/boxes', boxRoutes);
router.use('/boxes/:boxId/cards', cardRoutes);
router.use('/boxes/:boxId/play', playRoutes);
router.use('/boxes/:boxId/stats', statsRoutes);

module.exports = router;
