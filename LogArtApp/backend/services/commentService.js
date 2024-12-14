const commentRepository = require("../repositories/commentRepository");
const objectRepository = require("../repositories/objectRepository");
const userRepository = require("../repositories/userRepository");
const isValidMongoId = require("../utils/validId");

const createComment = async (content, objectId, userId) => {
  if (!content || !objectId || content.trim() === "") {
    const error = new Error("Both content and object Id are required");
    error.statusCode = 400;
    throw error;
  }
  if (!isValidMongoId(objectId)) {
    const error = new Error("Invalid object ID format");
    error.statusCode = 400;
    throw error;
  }
  const object = await objectRepository.findById(objectId);
  if (!object) {
    const error = new Error("Object not found");
    error.statusCode = 404;
    throw error;
  }
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  const userRole = user.role;
  if (object.createdBy.toString() !== userId && userRole !== "admin") {
    const error = new Error("You are not authorized to comment on this object");
    error.statusCode = 403;
    throw error;
  }
  const newComment = await commentRepository.createComment({
    content,
    object: objectId,
    user: userId,
  });
  return newComment;
};
const updateComment = async (commentId, content, userId) => {
  if (!content || content.trim() === "") {
    const error = new Error("Content is required");
    error.statusCode = 400;
    throw error;
  }
  if (!isValidMongoId(commentId)) {
    const error = new Error("Invalid comment ID format");
    error.statusCode = 400;
    throw error;
  }
  const comment = await commentRepository.findById(commentId);
  if (!comment) {
    const error = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
  }
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  const userRole = user.role;
  if (comment.user.toString() !== userId && userRole !== "admin") {
    const error = new Error("You are not authorized to update this comment");
    error.statusCode = 403;
    throw error;
  }
  const updateData = {
    content,
    updatedAt: Date.now(),
  };
  if (userRole === "admin" && comment.user.toString() !== userId) {
    updateData.isEditedByAdmin = true;
    updateData.editedBy = userId;
  }
  const updatedComment = await commentRepository.updateCommentById(
    commentId,
    updateData
  );
  return updatedComment;
};
const deleteComment = async (commentId, userId) => {
  if (!isValidMongoId(commentId)) {
    const error = new Error("Invalid comment ID format");
    error.statusCode = 400;
    throw error;
  }
  const comment = await commentRepository.findById(commentId);
  if (!comment) {
    const error = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
  }
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  const userRole = user.role;
  if (comment.user.toString() !== userId && userRole !== "admin") {
    const error = new Error("You are not authorized to delete this comment");
    error.statusCode = 403;
    throw error;
  }
  await commentRepository.deleteCommentById(commentId);
  return { message: "Comment deleted successfully" };
};
const getCommentsByObjectId = async (objectId, query, userId) => {
  const { page = 1, limit = 3, commentId } = query;
  const skip = (page - 1) * limit;
  if (!isValidMongoId(objectId)) {
    const error = new Error("Invalid object ID format");
    error.statusCode = 400;
    throw error;
  }
  const object = await objectRepository.findById(objectId);
  if (!object) {
    const error = new Error("Object not found");
    error.statusCode = 404;
    throw error;
  }
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  const userRole = user.role;
  const userIdFromObject = object.createdBy.toString();
  if (userId !== userIdFromObject && userRole !== "admin") {
    const error = new Error(
      "You are not authorized to view comments for this object"
    );
    error.statusCode = 403;
    throw error;
  }
  if (commentId) {
    if (!isValidMongoId(commentId)) {
      const error = new Error("Invalid comment ID format");
      error.statusCode = 400;
      throw error;
    }
    const comment = await commentRepository.findCommentsByObjectId(objectId, {
      commentId,
    });
    if (!comment || comment.length === 0) {
      const error = new Error("Comment not found");
      error.statusCode = 404;
      throw error;
    }
    return {
      comments: comment,
      totalComments: 1,
      currentPage: 1,
      totalPages: 1,
    };
  }
  const totalComments = await commentRepository.countCommentsByObjectId(
    objectId
  );
  const comments = await commentRepository.findCommentsByObjectId(objectId, {
    skip,
    limit,
  });
  return {
    comments,
    totalComments,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalComments / limit),
  };
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByObjectId,
};
