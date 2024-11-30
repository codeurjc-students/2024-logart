const express = require('express');
const router = express.Router();
const { allUsers, findUserById, deleteUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');
const { uploadProfile } = require('../middlewares/uploadImgMiddleware');

router.get('/', verifyToken, allUsers);
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, uploadProfile.single('profileImage') ,updateUserProfile);
router.get('/:userId', verifyToken, findUserById);
router.delete('/:userId', verifyToken, checkRole(['admin']), deleteUser);


module.exports = router;