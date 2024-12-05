const User = require("../models/user.model");
const BlacklistedToken = require("../models/blacklist.model");

const findUserByEmail = (email) => {
  return User.findOne({ email });
};

const findUserById = (userId) => {
  return User.findById(userId);
};

const createUser = (data) => {
  const newUser = new User(data);
  return newUser.save();
};

const updateUserById = (userId, updateData) => {
  return User.findByIdAndUpdate(userId, updateData, { new: true });
};

const addTokenToBlacklist = (token, expiresAt) => {
  const blacklistedToken = new BlacklistedToken({ token, expiresAt });
  return blacklistedToken.save();
};

const isTokenBlacklisted = async (token) => {
  const blacklisted = await BlacklistedToken.findOne({ token });
  return !!blacklisted;
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserById,
  addTokenToBlacklist,
  isTokenBlacklisted,
};
