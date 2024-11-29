const Object = require('../models/object.model');
const User = require('../models/user.model');
const Discipline = require('../models/discipline.model');
const isValidMongoId = require('../utils/validId');

const createObject = async (req, res) => {
  try {
    const { name, description, disciplineName } = req.body;

    if (!name || !disciplineName) {
      return res.status(400).json({ error: true, message: 'Both name and discipline are required' });
    }

    const discipline = await Discipline.findOne({ name: disciplineName });
    if (!discipline) {
      return res.status(404).json({ error: true, message: 'Discipline not found' });
    }

    const newObject = new Object({
      name,
      description,
      discipline: discipline._id,
      createdBy: req.user.userId,
    });

    await newObject.save();

    return res.status(201).location(`/api/v1/objects/${newObject._id}`).json({ object: newObject, message: 'Object created successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
    
  }
}

const updateObject = async (req, res) => {
  try {
    const objectIdFromParams = req.params.objectId;
    const { name, description, disciplineName } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const userRole = user.role;
    

    if (!isValidMongoId(objectIdFromParams)) {
      return res.status(400).json({ error: true, message: 'Invalid object ID format' });
    }

    const object = await Object.findById(objectIdFromParams);


    if (!object) {
      return res.status(404).json({ error: true, message: 'Object not found' });
    }
    console.log(userRole);
    if (object.createdBy.toString() !== userId && userRole !== 'admin') {
      
      return res.status(403).json({ error: true, message: 'You are not authorized to update this object' });
    }

    if (disciplineName) {
      const discipline = await Discipline.findOne({ name: disciplineName });
      if (!discipline) {
        return res.status(404).json({ error: true, message: 'Discipline not found' });
      }
      object.discipline = discipline._id;
    }

    if (name) {
      object.name = name;
    }
    if (description) {
      object.description = description;
    }
    object.updatedAt = Date.now();

    await object.save();
    return res.status(200).json({ object, message: 'Object updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const deleteObject = async (req, res) => {
  try {
    const objectIdFromParams = req.params.objectId;
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const userRole = user.role;

    if (!isValidMongoId(objectIdFromParams)) {
      return res.status(400).json({ error: true, message: 'Invalid object ID format' });
    }

    const object = await Object.findById(objectIdFromParams);
    if (!object) {
      return res.status(404).json({ error: true, message: 'Object not found' });
    }

    if (object.createdBy.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: true, message: 'You are not authorized to delete this object' });
    }

    await object.deleteOne();

    return res.status(200).json({ message: 'Object deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

module.exports = { createObject, updateObject, deleteObject };