const userRepository = require("../repositories/userRepository");
const fs = require("fs");
const path = require("path");
const isValidMongoId = require("../utils/validId");
const objectRepository = require("../repositories/objectRepository");
const commentRepository = require("../repositories/commentRepository");

const getAllUsers = async (page, limit) => {
  const users = await userRepository.findAllUsers(page, limit);
  const totalUsers = await userRepository.countUsers();

  const currentPage = parseInt(page);
  const totalPages = Math.ceil(totalUsers / limit);

  return { users, totalUsers, currentPage, totalPages };
};

const getUserById = async (userId) => {
  if (!isValidMongoId(userId)) {
    throw new Error("Invalid user ID format");
  }

  const user = await userRepository.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const deleteUser = async (userId, requestingUserId) => {
  if (!isValidMongoId(userId)) {
    const error = new Error("Invalid user ID format");
    error.statusCode = 400;
    throw error;
  }

  if (requestingUserId === userId) {
    const error = new Error(
      "You cannot delete your own account, contact the system administrator"
    );
    error.statusCode = 401;
    throw error;
  }

  const user = await userRepository.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const userObjects = await objectRepository.findObjectsByUserId(userId);

  if (Array.isArray(userObjects) && userObjects.length > 0) {
    const objectIds = userObjects.map((object) => object._id);

    await commentRepository.deleteCommentsByObjectIds(objectIds);

    for (const object of userObjects) {
      if (object.imageUrl && object.imageUrl !== "public/images/objects/zelda.jpg" && object.imageUrl !== "public/images/objects/bohemian_rhapsody.jpg" && object.imageUrl !== "public/images/objects/cien_años.jpg") {
    const imagePath = path.join(
      __dirname,
      "..",
      "public",
      "images",
      "objects",
      path.basename(object.imageUrl)
    );
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error("Error al eliminar la imagen del objeto:", err);
      }
    }
  }
    }

  

    await userRepository.deleteManyObjectsByUserId(userId);
  } else {
    console.warn(`No se encontraron objetos para el usuario con ID: ${userId}`);
  }

  await userRepository.deleteManyCommentsByUserId(userId);

  if (user.profileImage && user.profileImage !== "public/images/users/default.png") {
    const imagePath = path.join(
      __dirname,
      "..",
      "public",
      "images",
      "profiles",
      path.basename(user.profileImage)
    );
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error("Error al eliminar la imagen del usuario:", err);
      }
    }
  }

  await userRepository.deleteById(userId);

  return { message: "User and Data deleted successfully" };
};

const getUserProfile = async (userId) => {
  if (!isValidMongoId(userId)) {
    throw new Error("Invalid user ID format");
  }

  const user = await userRepository
    .findById(userId)
    .select(
      "-password -createdAt -hasToken -isVerified -verificationToken -__v"
    );

  if (!user) {
    throw new Error("User not found");
  }

  return { user };
};

const updateUserProfile = async (userId, updateData, file) => {
  if (!isValidMongoId(userId)) {
    throw new Error("Invalid user ID format");
  }

  const user = await userRepository.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const { firstName, lastName, email, username, bio } = updateData;
  if (username) user.username = username;
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (bio) user.bio = bio;

  if (file) {
    if (
      user.profileImage &&
      user.profileImage !== "/public/images/profiles/default-profile.png"
    ) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        "profiles",
        path.basename(user.profileImage)
      );
      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
        } catch (err) {
          console.error("Error al eliminar la imagen anterior:", err);
        }
      }
    }
    user.profileImage = `/public/images/profiles/${file.filename}`;
  }

  await user.save();

  return { user, message: "User updated successfully" };
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  getUserProfile,
  updateUserProfile,
};
