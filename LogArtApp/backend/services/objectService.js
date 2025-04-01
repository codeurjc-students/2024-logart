const objectRepository = require("../repositories/objectRepository");
const disciplineRepository = require("../repositories/disciplineRepository");
const userRepository = require("../repositories/userRepository");
const commentRepository = require("../repositories/commentRepository");
const User = require("../models/user.model");
const fs = require("fs");
const path = require("path");
const isValidMongoId = require("../utils/validId");
const crypto = require("crypto");

const createObject = async (data, userId, baseUrl) => {
  const { name, description, disciplineName } = data;
  if (!name || !disciplineName || name.trim() === "") {
    const error = new Error("Both name and discipline are required");
    error.statusCode = 400;
    throw error;
  }
  const discipline = await disciplineRepository.findByName(disciplineName);
  if (!discipline) {
    const error = new Error("Discipline not found");
    error.statusCode = 404;
    throw error;
  }
  if (!data.imageUrl) {
    const error = new Error("Image is required");
    error.statusCode = 400;
    throw error;
  }
  const newObject = await objectRepository.createObject({
    name,
    description,
    discipline: discipline._id,
    createdBy: userId,
    imageUrl: data.imageUrl,
  });
  return newObject;
};

const updateObject = async (objectId, data, userId) => {
  const { name, description, disciplineName, imageUrl } = data;
  if (!name || !disciplineName || name.trim() === "") {
    const error = new Error("Both name and discipline are required");
    error.statusCode = 400;
    throw error;
  }
  if (!isValidMongoId(objectId)) {
    const error = new Error("Invalid object ID format");
    error.statusCode = 400;
    throw error;
  }
  const object = await objectRepository.findById(objectId);
  if (!object) {
    const error = new Error("Object not found");
    error.statusCode = 404;
    throw error;
  }
  if (object.createdBy.toString() !== userId) {
    const user = await User.findById(userId);
    if (user.role !== "admin") {
      const error = new Error("You are not authorized to update this object");
      error.statusCode = 403;
      throw error;
    }
  }
  const discipline = await disciplineRepository.findByName(disciplineName);
  if (!discipline) {
    const error = new Error("Discipline not found");
    error.statusCode = 404;
    throw error;
  }
  if (name !== object.name) {
    const existingObject = await objectRepository.findByName(name);
    if (existingObject) {
      const error = new Error(
        "Another object with the same name already exists"
      );
      error.statusCode = 400;
      throw error;
    }
  }
  const updateData = {
    name,
    description,
    discipline: discipline._id,
    updatedAt: Date.now(),
  };
  if (imageUrl) {
    if (
      object.imageUrl &&
      object.imageUrl !== "public/images/objects/zelda.jpg" &&
      object.imageUrl !== "public/images/objects/bohemian_rhapsody.jpg" &&
      object.imageUrl !== "public/images/objects/cien_años.jpg"
    ) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        "objects",
        path.basename(object.imageUrl)
      );
      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
        } catch (err) {
          console.error("Error al eliminar la imagen anterior:", err);
        }
      }
    }
    updateData.imageUrl = imageUrl;
  }
  const updatedObject = await objectRepository.updateById(objectId, updateData);
  return updatedObject;
};

const deleteObject = async (objectId, userId) => {
  if (!isValidMongoId(objectId)) {
    const error = new Error("Invalid object ID format");
    error.statusCode = 400;
    throw error;
  }
  const object = await objectRepository.findById(objectId);
  if (!object) {
    const error = new Error("Object not found");
    error.statusCode = 404;
    throw error;
  }
  if (object.createdBy.toString() !== userId) {
    const user = await User.findById(userId);
    if (user.role !== "admin") {
      const error = new Error("You are not authorized to delete this object");
      error.statusCode = 403;
      throw error;
    }
  }
  if (
    object.imageUrl &&
    object.imageUrl !== "public/images/objects/zelda.jpg" &&
    object.imageUrl !== "public/images/objects/bohemian_rhapsody.jpg" &&
    object.imageUrl !== "public/images/objects/cien_años.jpg"
  ) {
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
  await commentRepository.deleteCommentsByObjectIds([objectId]);
  await userRepository.removeFromFavorites(userId, objectId);
  await objectRepository.deleteById(objectId);
  return { message: "Object deleted successfully" };
};

const getGalleryByDiscipline = async (disciplineName, query) => {
  const {
    userId,
    page = 1,
    limit = 3,
    objectName,
    favoritesOnly = false,
  } = query;
  const skip = (page - 1) * limit;
  const discipline = await disciplineRepository.findByName(disciplineName);
  if (!discipline) {
    const error = new Error("Discipline not found");
    error.statusCode = 404;
    throw error;
  }
  const filter = {
    discipline: discipline._id,
    createdBy: userId,
  };
  if (favoritesOnly === "true" && userId) {
    const user = await User.findById(userId);
    if (user && user.favorites && user.favorites.length > 0) {
      filter._id = { $in: user.favorites };
    } else {
      return {
        discipline: {
          id: discipline._id,
          name: discipline.name,
        },
        totalObjects: 0,
        objects: [],
        currentPage: parseInt(page),
        totalPages: 0,
      };
    }
  }
  if (objectName) {
    filter.name = { $regex: new RegExp(objectName, "i") };
  }

  const totalObjects = await objectRepository.countObjects(filter);
  const objects = await objectRepository.findObjects(filter, skip, limit);

  return {
    discipline: {
      id: discipline._id,
      name: discipline.name,
    },
    totalObjects,
    objects,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalObjects / limit),
  };
};

const getObjectById = async (objectId, userId) => {
  if (!isValidMongoId(objectId)) {
    const error = new Error("Invalid object ID format");
    error.statusCode = 400;
    throw error;
  }
  const object = await objectRepository
    .findById(objectId)
    .populate("discipline", "name")
    .populate("createdBy", "firstName lastName username");
  if (!object) {
    const error = new Error("Object not found");
    error.statusCode = 404;
    throw error;
  }
  if (object.createdBy._id.toString() !== userId) {
    const user = await User.findById(userId);
    const userRole = user.role;
    if (userRole !== "admin") {
      const error = new Error("You are not authorized to view this object");
      error.statusCode = 403;
      throw error;
    }
  }
  return object;
};

const togglePublicShare = async (objectId, userId) => {
  if (!isValidMongoId(objectId)) {
    const error = new Error("ID de objeto inválida");
    error.statusCode = 400;
    throw error;
  }
  const object = await objectRepository.findById(objectId);
  if (!object) {
    const error = new Error("Objeto no encontrado");
    error.statusCode = 404;
    throw error;
  }
  if (object.createdBy.toString() !== userId) {
    const error = new Error("No estás autorizado para compartir este objeto");
    error.statusCode = 403;
    throw error;
  }
  if (object.isPubliclyShared) {
    object.isPubliclyShared = false;
    object.publicShareCreatedAt = null;
  } else {
    object.isPubliclyShared = true;
    if (!object.publicShareId) {
      object.publicShareId = crypto.randomBytes(16).toString("hex");
    }
    object.publicShareCreatedAt = new Date();
  }
  await object.save();
  return {
    isPubliclyShared: object.isPubliclyShared,
    publicShareId: object.publicShareId,
    message: object.isPubliclyShared
      ? "El objeto ahora es público"
      : "El objeto ya no está siendo compartido",
  };
};

const getObjectByPublicShareId = async (shareId) => {
  if (!shareId || typeof shareId !== "string") {
    const error = new Error("Link not valid");
    error.statusCode = 400;
    throw error;
  }
  const object = await objectRepository
    .findByPublicShareId(shareId)
    .populate("discipline", "name")
    .populate("createdBy", "firstName lastName username");
  if (!object || !object.isPubliclyShared) {
    const error = new Error("El objeto ya no está compartido o no existe");
    error.statusCode = 404;
    throw error;
  }
  return object;
};

module.exports = {
  createObject,
  updateObject,
  deleteObject,
  getGalleryByDiscipline,
  getObjectById,
  togglePublicShare,
  getObjectByPublicShareId,
};
