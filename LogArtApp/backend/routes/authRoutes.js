const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/users', register);
router.post('/auth', login);
router.post('/logout', verifyToken , logout);

module.exports = router;