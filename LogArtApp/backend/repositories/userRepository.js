const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const ObjectModel = require("../models/object.model");

const findAllUsers = (page, limit) => {
  const skip = (page - 1) * limit;
  return User.find().skip(skip).limit(limit);
};
const countUsers = (filter = {}) => {
  return User.countDocuments(filter);
};
const findById = (userId) => {
  return User.findById(userId);
};
const deleteManyCommentsByUserId = (userId) => {
  return Comment.deleteMany({ user: userId });
};
const deleteManyObjectsByUserId = (userId) => {
  return ObjectModel.deleteMany({ createdBy: userId });
};
const deleteById = (userId) => {
  return User.findByIdAndDelete(userId);
};
const addToFavorites = (userId, objectId) => {
  return User.findByIdAndUpdate(
    userId,
    { $addToSet: { favorites: objectId } },
    { new: true }
  );
};
const removeFromFavorites = (userId, objectId) => {
  return User.findByIdAndUpdate(
    userId,
    { $pull: { favorites: objectId } },
    { new: true }
  );
};
const getUserFavorites = (userId) => {
  return User.findById(userId).select("favorites");
};

module.exports = {
  findAllUsers,
  countUsers,
  findById,
  deleteManyCommentsByUserId,
  deleteManyObjectsByUserId,
  deleteById,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
};
