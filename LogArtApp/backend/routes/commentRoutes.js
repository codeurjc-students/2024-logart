const express = require('express');
const router = express.Router();
const { createComment, updateComment, deleteComment} = require('../controllers/commentController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, createComment);
router.put('/:commentId', verifyToken, updateComment);
router.delete('/:commentId', verifyToken, deleteComment);

module.exports = router;