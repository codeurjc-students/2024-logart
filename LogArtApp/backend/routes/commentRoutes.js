const express = require('express');
const router = express.Router();
const { createComment, updateComment } = require('../controllers/commentController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, createComment);
router.put('/:commentId', verifyToken, updateComment);

module.exports = router;