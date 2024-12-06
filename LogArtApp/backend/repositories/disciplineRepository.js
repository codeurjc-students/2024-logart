const Discipline = require("../models/discipline.model");

const findAllDisciplines = () => {
  return Discipline.find();
};

const findByName = (name) => {
  return Discipline.findOne({ name });
};

const createDiscipline = (data) => {
  const newDiscipline = new Discipline(data);
  return newDiscipline.save();
};

const updateById = (disciplineId, updateData) => {
  return Discipline.findByIdAndUpdate(disciplineId, updateData, { new: true });
};

const deleteById = (disciplineId) => {
  return Discipline.findByIdAndDelete(disciplineId);
};

module.exports = {
  findAllDisciplines,
  findByName,
  createDiscipline,
  updateById,
  deleteById,
};
