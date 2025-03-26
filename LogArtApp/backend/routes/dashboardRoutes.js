const express = require("express");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/checkRole");

const {
  getOverviewStats,
  getUserStats,
  getContentStats,
  getActivityStats,
  getGrowthAnalysis,
  getAllObjects,
} = require("../controllers/dashboardController");
const router = express.Router();

router.get("/overview", verifyToken, checkRole(["admin"]), getOverviewStats);
router.get("/users", verifyToken, checkRole(["admin"]), getUserStats);
router.get("/content", verifyToken, checkRole(["admin"]), getContentStats);
router.get("/activity", verifyToken, checkRole(["admin"]), getActivityStats);
router.get("/growth", verifyToken, checkRole(["admin"]), getGrowthAnalysis);
router.get("/all-objects", verifyToken, checkRole(["admin"]), getAllObjects);

module.exports = router;
