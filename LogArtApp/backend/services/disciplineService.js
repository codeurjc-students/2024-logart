const disciplineRepository = require("../repositories/disciplineRepository");
const isValidMongoId = require("../utils/validId");

const getAllDisciplines = async () => {
  const disciplines = await disciplineRepository.findAllDisciplines();
  return disciplines;
};

const createDiscipline = async (data) => {
  const { name } = data;

  if (!name || name.trim() === "") {
    const error = new Error("Discipline name is required");
    error.statusCode = 400;
    throw error;
  }

  const existingDiscipline = await disciplineRepository.findByName(name);
  if (existingDiscipline) {
    const error = new Error("Discipline already exists");
    error.statusCode = 400;
    throw error;
  }

  const newDiscipline = await disciplineRepository.createDiscipline(data);
  return newDiscipline;
};

const updateDiscipline = async (disciplineId, updateData) => {
  if (!isValidMongoId(disciplineId)) {
    const error = new Error("Invalid discipline ID format");
    error.statusCode = 400;
    throw error;
  }

  const discipline = await disciplineRepository.findById(disciplineId);
  if (!discipline) {
    const error = new Error("Discipline not found");
    error.statusCode = 404;
    throw error;
  }

  if (updateData.name && updateData.name !== discipline.name) {
    const existingDiscipline = await disciplineRepository.findByName(
      updateData.name
    );
    if (existingDiscipline) {
      const error = new Error(
        "Another discipline with the same name already exists"
      );
      error.statusCode = 400;
      throw error;
    }
  }

  const updatedDiscipline = await disciplineRepository.updateById(
    disciplineId,
    updateData
  );
  return updatedDiscipline;
};

const deleteDiscipline = async (disciplineId) => {
  if (!isValidMongoId(disciplineId)) {
    const error = new Error("Invalid discipline ID format");
    error.statusCode = 400;
    throw error;
  }

  const discipline = await disciplineRepository.findById(disciplineId);
  if (!discipline) {
    const error = new Error("Discipline not found");
    error.statusCode = 404;
    throw error;
  }

  const ObjectModel = require("../models/object.model");
  const objects = await ObjectModel.find({ discipline: disciplineId });
  if (objects.length > 0) {
    const error = new Error("Cannot delete discipline with associated objects");
    error.statusCode = 400;
    throw error;
  }

  await disciplineRepository.deleteById(disciplineId);
  return { message: "Discipline deleted successfully" };
};

module.exports = {
  getAllDisciplines,
  createDiscipline,
  updateDiscipline,
  deleteDiscipline,
};
