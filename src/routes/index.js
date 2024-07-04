const { Router } = require('express');
const authRoutes = require('./authRoutes');
const boxRoutes = require('./boxRoutes');
const cardRoutes = require('./cardRoutes');
const playRoutes = require('./playRoutes');
const statsRoutes = require('./statsRoutes');
const proxyRoutes = require('./proxyRoutes');

const router = Router();

// todo : refaire la doc avec les nouveaux endpoints

router.get('/', (req, res) => {
  res.send('Welcome to the API. Please refer to the documentation for available endpoints.');
});

router.use('/auth', authRoutes);
router.use('/boxes', boxRoutes);
router.use('/boxes/:boxId/cards', cardRoutes);
router.use('/boxes/:boxId/play', playRoutes);
router.use('/boxes/:boxId/stats', statsRoutes);
router.use('/proxy', proxyRoutes);

router.use((req, res) => {
  res.status(404).json({ error: 'route not defined' });
});

module.exports = router;
