const dashboardService = require("../services/dashboardService");

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Operaciones del dashboard de administrador
 */

/**
 * @swagger
 * /dashboard/overview:
 *   get:
 *     summary: Obtener estadísticas generales
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 */
const getOverviewStats = async (req, res) => {
  try {
    const stats = await dashboardService.getOverviewStats();
    return res.status(200).json(stats);
  } catch (error) {
    console.error("Error en getOverviewStats:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

/**
 * @swagger
 * /dashboard/users:
 *   get:
 *     summary: Obtener estadísticas de usuarios
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 */
const getUserStats = async (req, res) => {
  try {
    const stats = await dashboardService.getUserStats();
    return res.status(200).json(stats);
  } catch (error) {
    console.error("Error en getUserStats:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

/**
 * @swagger
 * /dashboard/content:
 *   get:
 *     summary: Obtener estadísticas de contenido
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 */
const getContentStats = async (req, res) => {
  try {
    const stats = await dashboardService.getContentStats();
    return res.status(200).json(stats);
  } catch (error) {
    console.error("Error en getContentStats:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

/**
 * @swagger
 * /dashboard/activity:
 *   get:
 *     summary: Obtener estadísticas de actividad
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *           default: weekly
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 */
const getActivityStats = async (req, res) => {
  try {
    const { period = "weekly" } = req.query;
    const stats = await dashboardService.getActivityStats(period);
    return res.status(200).json(stats);
  } catch (error) {
    console.error("Error en getActivityStats:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

/**
 * @swagger
 * /dashboard/growth:
 *   get:
 *     summary: Obtener análisis de crecimiento
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [weekly, monthly, quarterly]
 *           default: monthly
 *     responses:
 *       200:
 *         description: Análisis obtenido exitosamente
 */
const getGrowthAnalysis = async (req, res) => {
  try {
    const { period = "monthly" } = req.query;
    const analysis = await dashboardService.getGrowthAnalysis(period);
    return res.status(200).json(analysis);
  } catch (error) {
    console.error("Error en getGrowthAnalysis:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

/**
 * @swagger
 * /dashboard/objects:
 *   get:
 *     summary: Obtener todos los objetos para moderación
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: disciplineName
 *         schema:
 *           type: string
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Objetos obtenidos exitosamente
 */
const getAllObjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, disciplineName, searchTerm } = req.query;
    const objects = await dashboardService.getAllObjects({
      page: parseInt(page),
      limit: parseInt(limit),
      disciplineName,
      searchTerm,
    });
    return res.status(200).json(objects);
  } catch (error) {
    console.error("Error en getAllObjects:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getOverviewStats,
  getUserStats,
  getContentStats,
  getActivityStats,
  getGrowthAnalysis,
  getAllObjects,
};
