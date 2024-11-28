const express = require('express');
const router = express.Router();
const { allUsers, findUserById } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, allUsers);
router.get('/:userId', verifyToken, findUserById);

module.exports = router;