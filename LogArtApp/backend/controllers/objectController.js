const Object = require('../models/object.model');
const Discipline = require('../models/discipline.model');

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

module.exports = { createObject };