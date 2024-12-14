const ObjectModel = require("../models/object.model");

const createObject = (data) => {
  const newObject = new ObjectModel(data);
  return newObject.save();
};
const findById = (objectId) => {
  return ObjectModel.findById(objectId);
};
const findByName = (name) => {
  return ObjectModel.findOne({ name });
};
const updateById = (objectId, updateData) => {
  return ObjectModel.findByIdAndUpdate(objectId, updateData, { new: true });
};
const deleteById = (objectId) => {
  return ObjectModel.findByIdAndDelete(objectId);
};
const findObjects = (filter, skip, limit) => {
  return ObjectModel.find(filter)
    .populate("createdBy", "firstName lastName username")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};
const countObjects = (filter) => {
  return ObjectModel.countDocuments(filter);
};
const findObjectsByUserId = (userId) => {
  return ObjectModel.find({ createdBy: userId });
};

module.exports = {
  createObject,
  findById,
  findByName,
  updateById,
  deleteById,
  findObjects,
  countObjects,
  findObjectsByUserId,
};
