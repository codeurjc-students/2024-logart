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
const findUserByResetToken = (token) => {
  return User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
};

const updateResetPasswordToken = (userId, token, expires) => {
  return User.findByIdAndUpdate(
    userId,
    {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    },
    { new: true }
  );
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserById,
  addTokenToBlacklist,
  isTokenBlacklisted,
  findUserByResetToken,
  updateResetPasswordToken,
};
