const Comment = require('../models/comment.model');
const Object = require('../models/object.model');
const User = require('../models/user.model');
const isValidMongoId = require('../utils/validId');

const createComment = async (req, res) => {
  try {
    const { content, objectId } = req.body;
    const user = await User.findById(req.user.userId);
    const userRole = user.role;

    if (!isValidMongoId(objectId)) {
      return res.status(400).json({ error: true, message: 'Invalid object ID format' });
    }
    

    if (!content || !objectId || content.trim() === '' ){
      return res.status(400).json({ error: true, message: 'Both content and object Id are required' });
    }

    const object = await Object.findById(objectId);

    if (req.user.userId !== object.createdBy.toString() && userRole !== 'admin') {
      return res.status(403).json({ error: true, message: 'You are not authorized to comment on this object' });
    }

    if (!object) {
      return res.status(404).json({ error: true, message: 'Object not found' });
    }

    const newComment = new Comment({
      content,
      object: objectId,
      user: req.user.userId,
    });

    await newComment.save();

    return res.status(201).location(`/api/v1/comments/${object._id}/${newComment._id}`).json({ comment: newComment, message: 'Comment created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const updateComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const userRole = user.role;

    if (!isValidMongoId(commentId)) {
      return res.status(400).json({ error: true, message: 'Invalid comment ID format' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: true, message: 'Comment not found' });
    }
    if (comment.user.toString() !== req.user.userId && userRole !== 'admin') {
      return res.status(403).json({ error: true, message: 'You are not authorized to update this comment' });
    }

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: true, message: 'Content is required' });
    }

    comment.content = content;
    comment.updatedAt = Date.now();

    await comment.save();

    return res.status(200).json({ comment, message: 'Comment updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const userRole = user.role;

    if (!isValidMongoId(commentId)) {
      return res.status(400).json({ error: true, message: 'Invalid comment ID format' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: true, message: 'Comment not found' });
    }
    if (comment.user.toString() !== req.user.userId && userRole !== 'admin') {
      return res.status(403).json({ error: true, message: 'You are not authorized to delete this comment' });
    }

    await comment.deleteOne();

    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const getCommentsByObjectId = async (req, res) => {
  try {
    const objectId = req.params.objectId;
    const { page=1, limit=3 } = req.query;
    const skip = (page - 1) * limit;
    const userIdFromToken = req.user.userId;
    const object = await Object.findById(objectId);
    const userIdFromObject = object.createdBy.toString();

    const user = await User.findById(userIdFromToken);
    const userRole = user.role;

    if (!isValidMongoId(objectId)) {
      return res.status(400).json({ error: true, message: 'Invalid object ID format' });
    }

    

    if (userIdFromToken !== userIdFromObject && userRole !== 'admin') {
      return res.status(403).json({ error: true, message: 'You are not authorized to view comments for this object' });
    }

    const totalComments = await Comment.countDocuments({ object: objectId });

    const comments = await Comment.find({ object: objectId }).populate( 'user', 'username email').sort({ createdAt: -1 }).skip(skip).limit(limit);

    return res.status(200).json({ comments, totalComments, currentPage: parseInt(page), totalPages: Math.ceil(totalComments / limit) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};


module.exports = { createComment, updateComment, deleteComment, getCommentsByObjectId };