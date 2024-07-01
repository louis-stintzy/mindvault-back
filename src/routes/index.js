const { Router } = require('express');
const boxRoutes = require('./boxRoutes');

const router = Router();

router.use('/box', boxRoutes);

module.exports = router;
