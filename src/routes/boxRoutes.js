const { Router } = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const verifyBoxOwner = require('../middlewares/verifyBoxOwner');
const { upload, handleUploadError } = require('../middlewares/upload');

const {
  getBoxes,
  getBoxById,
  createBox,
  updateBox,
  updateBoxLearnItValue,
  deleteBox,
} = require('../controllers/boxController');

const router = Router();

// todo : utiliser sharp lors de l'upload d'image ?

router.get('/:boxId', authenticateToken, verifyBoxOwner, getBoxById);
router.get('/', authenticateToken, getBoxes);
router.post('/', authenticateToken, upload.single('image'), handleUploadError, createBox);
router.put('/:boxId', authenticateToken, verifyBoxOwner, upload.single('image'), handleUploadError, updateBox);
router.patch('/:boxId/learnit', authenticateToken, verifyBoxOwner, updateBoxLearnItValue);
router.delete('/:boxId', authenticateToken, verifyBoxOwner, deleteBox);

module.exports = router;
