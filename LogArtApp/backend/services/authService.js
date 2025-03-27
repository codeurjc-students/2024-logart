const authRepository = require("../repositories/authRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/emailService");
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
  const verificationLink = `https://localhost:5173/verify-email/${verificationToken}`;
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
    const verifiedUser = await User.findOne({
      isVerified: true,
      verificationToken: null,
    });
    if (verifiedUser) {
      return { message: "Email already verified. Please login." };
    }
    const error = new Error("Invalid or expired token");
    error.statusCode = 404;
    throw error;
  }
  if (user.isVerified) {
    return { message: "Email already verified. Please login." };
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

const requestPasswordReset = async (email) => {
  if (!email || email.trim() === "") {
    const error = new Error("El email es obligatorio");
    error.statusCode = 400;
    throw error;
  }
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    return {
      message:
        "Si tu correo electrónico existe, recibirás un enlace para restablecer tu contraseña",
    };
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetExpires = new Date(Date.now() + 3600000);

  await authRepository.updateResetPasswordToken(
    user._id,
    resetToken,
    resetExpires
  );

  const resetLink = `https://localhost:5173/reset-password/${resetToken}`;
  await sendPasswordResetEmail(email, resetLink);

  return {
    message:
      "Si tu correo electrónico existe, recibirás un enlace para restablecer tu contraseña",
  };
};

const resetPassword = async (token, newPassword) => {
  if (
    !token ||
    !newPassword ||
    token.trim() === "" ||
    newPassword.trim() === ""
  ) {
    const error = new Error("El Token y la nueva contraseña son obligatorios");
    error.statusCode = 400;
    throw error;
  }
  const user = await authRepository.findUserByResetToken(token);
  if (!user) {
    const error = new Error("Token inválido o expirado");
    error.statusCode = 400;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();
  return { message: "Contraseña restablecida con éxito" };
};

module.exports = {
  login,
  register,
  verifyUser,
  logout,
  requestPasswordReset,
  resetPassword,
};
