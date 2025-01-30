const authRepository = require("../repositories/authRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/emailService");
const { accessTokenSecret, url } = require("../config/environment");
const isValidMongoId = require("../utils/validId");
const User = require("../models/user.model");

const login = async (email, password) => {
  if (!email || !password || email.trim() === "" || password.trim() === "") {
    const error = new Error("Both fields are required");
    error.statusCode = 400;
    throw error;
  }
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }
  if (!user.isVerified) {
    const error = new Error("Please verify your email before logging in");
    error.statusCode = 401;
    throw error;
  }
  if (user.hastoken) {
    const error = new Error("User already logged in");
    error.statusCode = 401;
    throw error;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }
  const accessToken = jwt.sign({ userId: user._id }, accessTokenSecret, {
    expiresIn: "24h",
  });
  user.hastoken = true;
  await user.save();
  return { accessToken, user };
};

const register = async (data) => {
  const { password, email, firstName, lastName, username } = data;
  const loggedUser = await User.findOne({ hastoken: true });
  if (loggedUser) {
    if (loggedUser.email === email) {
      const error = new Error("You are already logged in");
      error.statusCode = 401;
      throw error;
    }
  }
  if (
    !password ||
    !email ||
    !firstName ||
    !lastName ||
    !username ||
    password.trim() === "" ||
    email.trim() === "" ||
    firstName.trim() === "" ||
    lastName.trim() === "" ||
    username.trim() === ""
  ) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }
  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await authRepository.createUser({
    password: hashedPassword,
    email,
    firstName,
    lastName,
    username,
    verificationToken,
  });
  const verificationLink = `${url}/api/v1/verify/${verificationToken}`;
  await sendVerificationEmail(email, verificationLink);
  return {
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    },
    message: "User registered, please check your email to verify your account",
  };
};
const verifyUser = async (token) => {
  if (!token || token.trim() === "") {
    const error = new Error("Verification token is required");
    error.statusCode = 400;
    throw error;
  }
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 404;
    throw error;
  }
  user.isVerified = true;
  user.verificationToken = null;
  await user.save();
  return { message: "User verified successfully" };
};
const logout = async (token, userId) => {
  if (!token) {
    const error = new Error("No token provided");
    error.statusCode = 401;
    throw error;
  }
  try {
    const decoded = jwt.verify(token, accessTokenSecret);
    const originalExpirationDate = new Date(decoded.exp * 1000);
    const ADDITIONAL_TOKEN_EXP_TIME = 5 * 60 * 1000;
    const extendedExpirationDate = new Date(
      originalExpirationDate.getTime() + ADDITIONAL_TOKEN_EXP_TIME
    );
    await authRepository.addTokenToBlacklist(token, extendedExpirationDate);
    const user = await authRepository.findUserById(userId);
    if (user) {
      user.hastoken = false;
      await user.save();
    }
    return { message: "Logout successful" };
  } catch (error) {
    console.error("Error during logout:", error);
    const err = new Error("Internal server error");
    err.statusCode = 500;
    throw err;
  }
};

module.exports = {
  login,
  register,
  verifyUser,
  logout,
};
