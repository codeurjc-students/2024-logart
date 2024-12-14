const User = require("../models/user.model");

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const userIdFromToken = req.user?.userId;
      const user = await User.findById(userIdFromToken);
      if (!user || !roles.includes(user.role)) {
        return res.status(401).json({ error: true, message: "Access denied" });
      }
      next();
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  };
};

module.exports = checkRole;
