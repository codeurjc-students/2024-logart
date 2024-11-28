const express = require('express');
const { register, login, logout, verifyUser } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/users', register);
router.post('/auth', login);
router.post('/logout', verifyToken , logout);
router.get('/verify/:token', verifyUser);

module.exports = router;