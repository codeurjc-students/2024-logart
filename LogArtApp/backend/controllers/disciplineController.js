const disciplineService = require("../services/disciplineService");

/**
 * @swagger
 * tags:
 *   name: Disciplinas
 *   description: Operaciones relacionadas con las disciplinas
 */

/**
 * @swagger
 * /disciplines:
 *   get:
 *     summary: Obtener todas las disciplinas
 *     tags: [Disciplinas]
 *     responses:
 *       200:
 *         description: Lista de disciplinas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetAllDisciplinesResponse'
 *       500:
 *         description: Error interno del servidor al obtener disciplinas
 */
const getAllDisciplines = async (req, res) => {
  try {
    const disciplines = await disciplineService.getAllDisciplines();
    return res.status(200).json({ disciplines });
  } catch (error) {
    console.error("Error en getAllDisciplines:", error);
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ error: true, message: error.message });
    }
    return res
      .status(500)
      .json({ error: true, message: "Error obteniendo disciplinas" });
  }
};

const createDiscipline = async (req, res) => {
  try {
    const disciplineData = req.body;
    const newDiscipline = await disciplineService.createDiscipline(
      disciplineData
    );
    return res
      .status(201)
      .json({
        discipline: newDiscipline,
        message: "Discipline created successfully",
      });
  } catch (error) {
    console.error("Error en createDiscipline:", error);
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ error: true, message: error.message });
    }
    return res
      .status(500)
      .json({ error: true, message: "Error creando disciplina" });
  }
};

const updateDiscipline = async (req, res) => {
  try {
    const { disciplineId } = req.params;
    const updateData = req.body;
    const updatedDiscipline = await disciplineService.updateDiscipline(
      disciplineId,
      updateData
    );
    return res
      .status(200)
      .json({
        discipline: updatedDiscipline,
        message: "Discipline updated successfully",
      });
  } catch (error) {
    console.error("Error en updateDiscipline:", error);
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ error: true, message: error.message });
    }
    return res
      .status(500)
      .json({ error: true, message: "Error actualizando disciplina" });
  }
};

const deleteDiscipline = async (req, res) => {
  try {
    const { disciplineId } = req.params;
    const result = await disciplineService.deleteDiscipline(disciplineId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en deleteDiscipline:", error);
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ error: true, message: error.message });
    }
    return res
      .status(500)
      .json({ error: true, message: "Error eliminando disciplina" });
  }
};

module.exports = {
  getAllDisciplines,
  createDiscipline,
  updateDiscipline,
  deleteDiscipline,
};
