const objectRepository = require("../repositories/objectRepository");
const disciplineRepository = require("../repositories/disciplineRepository");
const commentRepository = require("../repositories/commentRepository");
const User = require("../models/user.model");
const fs = require("fs");
const path = require("path");
const isValidMongoId = require("../utils/validId");

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

  const existingObject = await objectRepository.findByName(name);
  if (existingObject) {
    const error = new Error("Cannot create two objects with the same name");
    error.statusCode = 400;
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
      object.imageUrl !== "/public/images/objects/default-object.png"
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

  if (object.imageUrl) {
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

  await objectRepository.deleteById(objectId);

  return { message: "Object deleted successfully" };
};

const getGalleryByDiscipline = async (disciplineName, query) => {
  const { userId, page = 1, limit = 3, objectName } = query;
  const skip = (page - 1) * limit;

  const discipline = await disciplineRepository.findByName(disciplineName);
  if (!discipline) {
    const error = new Error("Discipline not found");
    error.statusCode = 404;
    throw error;
  }

  const filter = { discipline: discipline._id };
  if (userId) {
    filter.createdBy = userId;
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
    if (user.role !== "admin") {
      const error = new Error("You are not authorized to view this object");
      error.statusCode = 403;
      throw error;
    }
  }

  return object;
};

module.exports = {
  createObject,
  updateObject,
  deleteObject,
  getGalleryByDiscipline,
  getObjectById,
};
