const userService = require("../services/userService");

const allUsers = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const result = await userService.getAllUsers(page, limit);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en allUsers:", error);
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ error: true, message: error.message });
    }
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

const findUserById = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const requestingUserId = req.user.userId;

    const requestingUserProfile = await userService.getUserProfile(
      requestingUserId
    );
    const userRole = requestingUserProfile.user.role;

    if (targetUserId !== requestingUserId && userRole !== "admin") {
      return res.status(401).json({ error: true, message: "Unauthorized" });
    }

    const user = await userService.getUserById(targetUserId);
    return res.status(200).json({ user, message: "User found" });
  } catch (error) {
    console.error("Error en findUserById:", error);
    if (error.message === "Unauthorized") {
      return res.status(401).json({ error: true, message: error.message });
    } else if (error.message === "User not found") {
      return res.status(404).json({ error: true, message: error.message });
    } else if (error.message === "Invalid user ID format") {
      return res.status(400).json({ error: true, message: error.message });
    } else {
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.userId;

    const requestingUserProfile = await userService.getUserProfile(
      requestingUserId
    );
    const userRole = requestingUserProfile.user.role;

    if (userRole !== "admin") {
      return res
        .status(403)
        .json({
          error: true,
          message: "Forbidden: Only admin can delete users",
        });
    }

    if (requestingUserId === userId) {
      return res
        .status(401)
        .json({
          error: true,
          message:
            "You cannot delete your own account, contact the system administrator",
        });
    }

    const result = await userService.deleteUser(userId, requestingUserId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en deleteUser:", error);
    if (error.message === "Invalid object ID format") {
      return res.status(400).json({ error: true, message: error.message });
    } else if (error.message === "User not found") {
      return res.status(404).json({ error: true, message: error.message });
    } else if (
      error.message ===
      "You cannot delete your own account, contact the system administrator"
    ) {
      return res.status(401).json({ error: true, message: error.message });
    } else {
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await userService.getUserProfile(userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en getUserProfile:", error);
    if (error.message === "User not found") {
      return res.status(404).json({ error: true, message: error.message });
    } else if (error.message === "Invalid user ID format") {
      return res.status(400).json({ error: true, message: error.message });
    } else {
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = req.body;
    const file = req.file;

    const result = await userService.updateUserProfile(
      userId,
      updateData,
      file
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en updateUserProfile:", error);
    if (error.message === "Invalid user ID format") {
      return res.status(400).json({ error: true, message: error.message });
    } else if (error.message === "User not found") {
      return res.status(404).json({ error: true, message: error.message });
    } else {
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  }
};

module.exports = {
  allUsers,
  findUserById,
  deleteUser,
  getUserProfile,
  updateUserProfile,
};
