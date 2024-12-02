const Discipline = require('../models/discipline.model');

const getAllDisciplines = async (req, res) => {
  try {
    const disciplines = await Discipline.find();
    res.status(200).json({ disciplines });
  } catch (error) {
    console.error('Error getting disciplines:', error);
    res.status(500).json({ error: 'Error getting disciplines' });
  }
};

module.exports = { getAllDisciplines };
