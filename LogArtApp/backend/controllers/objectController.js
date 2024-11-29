const Object = require('../models/object.model');
const path = require('path');
const fs = require('fs');
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

    const image = req.file ? req.file.path: null;

    const newObject = new Object({
      name,
      description,
      discipline: discipline._id,
      createdBy: req.user.userId,
      imageUrl: image
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
    if (req.file) {
      const oldImagePath = path.join(__dirname, '..', 'public', 'images', path.basename(object.imageUrl));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); 
      }
      object.imageUrl = `${process.env.BASE_URL}/public/images/${req.file.filename}`;
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

    const imagePath = path.join(__dirname, '..', 'public', 'images', path.basename(object.imageUrl));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); 
    }

    await object.deleteOne();

    return res.status(200).json({ message: 'Object deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const getGalleryByDiscipline = async (req, res) => {
  try {
    const disciplineName = req.params.disciplineName;
    const disciplineId = await Discipline.findOne({ name: disciplineName }).select('_id');
    const { userId, page=1, limit=3, objectName }  = req.query;
    const skip = (page - 1) * limit;
    const userIdFromToken = req.user.userId;
    const user = await User.findById(userIdFromToken)
    const userRole = user.role;

    if (!userId){
      if (userRole !== 'admin') {
        return res.status(403).json({ error: true, message: 'You are not authorized to view this' });
      }
    }

    if (userId){
      if (userId !== userIdFromToken && userRole !== 'admin') {
        return res.status(403).json({ error: true, message: 'You are not authorized to view this' });
      }

    }


    let totalObjects;
    const countFilter = {discipline: disciplineId};
    if (userId) {
      countFilter.createdBy = userId;
    }
    if (objectName) {
      countFilter.name = {$regex: new RegExp(objectName, 'i')};
    }
    totalObjects = await Object.countDocuments(countFilter);
    

    const discipline = await Discipline.findById(disciplineId);
    if (!discipline) {
      return res.status(404).json({ error: true, message: 'Discipline not found' });
    }

    const filter = {discipline: disciplineId};
    if (userId) {
      filter.createdBy = userId;
    }
    if (objectName) {
      filter.name = {$regex: new RegExp(objectName, 'i')};
    }

    const objects = await Object.find(filter).populate('createdBy', 'firstName lastName username').sort({ createdAt: -1 }).skip(skip).limit(limit);

    const objectsWithImageUrls = objects.map((obj) => ({
  ...obj._doc, 
  imageUrl: `${req.protocol}://${req.get('host')}/${obj.imageUrl.replace(/\\/g, '/')}`, 
}));


    return res.status(200).json({ 
      discipline: {
        id: discipline._id,
        name: discipline.name,
      }, totalObjects,
      objects: objectsWithImageUrls,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalObjects / limit)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

module.exports = { createObject, updateObject, deleteObject, getGalleryByDiscipline };