const Comment = require("../models/comment.model");

const createComment = (data) => {
  const newComment = new Comment(data);
  return newComment.save();
};

const findById = (commentId) => {
  return Comment.findById(commentId);
};

const findCommentsByObjectId = (objectId, options) => {
  const { skip, limit, commentId } = options;

  if (commentId) {
    return Comment.find({ _id: commentId, object: objectId })
      .populate("user", "username email")
      .exec();
  }

  return Comment.find({ object: objectId })
    .populate("user", "username email role _id")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
};

const countCommentsByObjectId = (objectId) => {
  return Comment.countDocuments({ object: objectId });
};

const updateCommentById = (commentId, updateData) => {
  return Comment.findByIdAndUpdate(commentId, updateData, { new: true });
};

const deleteCommentById = (commentId) => {
  return Comment.findByIdAndDelete(commentId);
};

const deleteCommentsByObjectIds = (objectIds) => {
  return Comment.deleteMany({ object: { $in: objectIds } });
};

module.exports = {
  createComment,
  findById,
  findCommentsByObjectId,
  countCommentsByObjectId,
  updateCommentById,
  deleteCommentById,
  deleteCommentsByObjectIds,
};
