const express = require('express');
const router = express.Router();
const { createComment } = require('../controllers/commentController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, createComment);

module.exports = router;