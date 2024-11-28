const express = require('express');
const router = express.Router();
const { allUsers, findUserById, deleteUser } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');

router.get('/', verifyToken, allUsers);
router.get('/:userId', verifyToken, findUserById);
router.delete('/:userId', verifyToken, checkRole(['admin']), deleteUser);

module.exports = router;