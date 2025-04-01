const express = require("express");
const {
  createObject,
  updateObject,
  deleteObject,
  getGalleryByDiscipline,
  getObjectById,
  togglePublicShare,
  getPublicObject,
  toggleFavorite,
} = require("../controllers/objectController");
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  uploadObject,
  uploadProfile,
} = require("../middlewares/uploadImgMiddleware");
const router = express.Router();

router.post("/", verifyToken, uploadObject.single("imageUrl"), createObject);
router.put(
  "/:objectId",
  verifyToken,
  uploadObject.single("imageUrl"),
  updateObject
);
router.delete("/:objectId", verifyToken, deleteObject);
router.get("/details/:objectId", verifyToken, getObjectById);
router.get("/:disciplineName", verifyToken, getGalleryByDiscipline);
router.get("/details/:objectId", verifyToken, getObjectById);
router.post("/:objectId/share", verifyToken, togglePublicShare);
router.get("/shared/:shareId", getPublicObject);
router.post("/:objectId/favorite", verifyToken, toggleFavorite);

module.exports = router;
