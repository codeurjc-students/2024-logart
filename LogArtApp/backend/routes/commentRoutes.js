const express = require('express');
const router = express.Router();
const { createComment, updateComment, deleteComment, getCommentsByObjectId } = require('../controllers/commentController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, createComment);
router.put('/:commentId', verifyToken, updateComment);
router.delete('/:commentId', verifyToken, deleteComment);
router.get('/:objectId', verifyToken, getCommentsByObjectId);

module.exports = router;