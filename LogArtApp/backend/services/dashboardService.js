const userRepository = require("../repositories/userRepository");
const objectRepository = require("../repositories/objectRepository");
const commentRepository = require("../repositories/commentRepository");
const disciplineRepository = require("../repositories/disciplineRepository");
const User = require("../models/user.model");
const Object = require("../models/object.model");
const Comment = require("../models/comment.model");

const calculateGrowthPercentage = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

const getOverviewStats = async () => {
  try {
    const totalUsers = await userRepository.countUsers({});
    const totalObjects = await objectRepository.countObjects({});
    const totalComments = await commentRepository.countComments();
    const objectsByDiscipline = await Object.aggregate([
      {
        $lookup: {
          from: "disciplines",
          localField: "discipline",
          foreignField: "_id",
          as: "disciplineInfo",
        },
      },
      {
        $unwind: "$disciplineInfo",
      },
      {
        $group: {
          _id: "$disciplineInfo.name",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          discipline: "$_id",
          count: 1,
        },
      },
    ]);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentObjects = await objectRepository.countObjects({
      createdAt: { $gte: oneWeekAgo },
    });

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const previousWeekObjects = await objectRepository.countObjects({
      createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo },
    });

    const objectsGrowth = calculateGrowthPercentage(
      recentObjects,
      previousWeekObjects
    );

    return {
      totalUsers,
      totalObjects,
      totalComments,
      objectsByDiscipline,
      recentObjects,
      objectsGrowth,
    };
  } catch (error) {
    console.error("Error en getOverviewStats:", error);
    throw error;
  }
};

const getUserStats = async () => {
  try {
    const totalUsers = await userRepository.countUsers({});
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          role: "$_id",
          count: 1,
        },
      },
    ]);

    const usersByObjectCount = await Object.aggregate([
      {
        $group: {
          _id: "$createdBy",
          objectCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          userName: "$userInfo.username",
          objectCount: 1,
        },
      },
      {
        $sort: { objectCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);
    return {
      totalUsers,
      usersByRole,
      usersByObjectCount,
    };
  } catch (error) {
    console.error("Error en getUserStats:", error);
    throw error;
  }
};

const getContentStats = async () => {
  try {
    const objectsByDiscipline = await Object.aggregate([
      {
        $lookup: {
          from: "disciplines",
          localField: "discipline",
          foreignField: "_id",
          as: "disciplineInfo",
        },
      },
      {
        $unwind: "$disciplineInfo",
      },
      {
        $group: {
          _id: "$disciplineInfo.name",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          discipline: "$_id",
          count: 1,
        },
      },
    ]);

    const mostCommentedObjects = await Comment.aggregate([
      {
        $group: {
          _id: "$object",
          commentCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "objects",
          localField: "_id",
          foreignField: "_id",
          as: "objectInfo",
        },
      },
      {
        $unwind: "$objectInfo",
      },
      {
        $project: {
          _id: 0,
          objectId: "$objectInfo._id",
          name: "$objectInfo.name",
          commentCount: 1,
        },
      },
      {
        $sort: { commentCount: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    return {
      objectsByDiscipline,
      mostCommentedObjects,
    };
  } catch (error) {
    console.error("Error en getContentStats:", error);
    throw error;
  }
};

const getActivityStats = async (period = "weekly") => {
  try {
    const lookBackDays =
      period === "daily" ? 14 : period === "weekly" ? 84 : 365;

    const lookBackDate = new Date();
    lookBackDate.setDate(lookBackDate.getDate() - lookBackDays);

    const objectsActivity = await Object.aggregate([
      {
        $match: {
          createdAt: { $gte: lookBackDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format:
                period === "daily"
                  ? "%Y-%m-%d"
                  : period === "weekly"
                  ? "%Y-%U"
                  : "%Y-%m",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return {
      period,
      objectsActivity: objectsActivity.map((item) => ({
        period: item._id,
        count: item.count,
      })),
    };
  } catch (error) {
    console.error("Error en getActivityStats:", error);
    throw error;
  }
};

const getGrowthAnalysis = async (period = "monthly") => {
  try {
    const periodInDays = {
      weekly: 7,
      monthly: 30,
      quarterly: 90,
    };

    const days = periodInDays[period] || 30;

    const currentPeriodEnd = new Date();
    const currentPeriodStart = new Date();
    currentPeriodStart.setDate(currentPeriodEnd.getDate() - days);
    const previousPeriodEnd = new Date(currentPeriodStart);
    const previousPeriodStart = new Date(previousPeriodEnd);
    previousPeriodStart.setDate(previousPeriodEnd.getDate() - days);

    const currentStats = {
      users: await userRepository.countUsers({
        createdAt: { $gte: currentPeriodStart, $lt: currentPeriodEnd },
      }),
      objects: await Object.countDocuments({
        createdAt: { $gte: currentPeriodStart, $lt: currentPeriodEnd },
      }),
      comments: await Comment.countDocuments({
        createdAt: { $gte: currentPeriodStart, $lt: currentPeriodEnd },
      }),
    };

    const previousStats = {
      users: await userRepository.countUsers({
        createdAt: { $gte: previousPeriodStart, $lt: previousPeriodEnd },
      }),
      objects: await Object.countDocuments({
        createdAt: { $gte: previousPeriodStart, $lt: previousPeriodEnd },
      }),
      comments: await Comment.countDocuments({
        createdAt: { $gte: previousPeriodStart, $lt: previousPeriodEnd },
      }),
    };

    const growthRates = {
      users: calculateGrowthPercentage(currentStats.users, previousStats.users),
      objects: calculateGrowthPercentage(
        currentStats.objects,
        previousStats.objects
      ),
      comments: calculateGrowthPercentage(
        currentStats.comments,
        previousStats.comments
      ),
    };

    return {
      period,
      metrics: {
        users: {
          current: currentStats.users,
          previous: previousStats.users,
          growth: growthRates.users,
        },
        objects: {
          current: currentStats.objects,
          previous: previousStats.objects,
          growth: growthRates.objects,
        },
        comments: {
          current: currentStats.comments,
          previous: previousStats.comments,
          growth: growthRates.comments,
        },
      },
    };
  } catch (error) {
    console.error("Error en getGrowthAnalysis:", error);
    throw error;
  }
};

const getAllObjects = async ({
  page = 1,
  limit = 10,
  disciplineName,
  searchTerm,
}) => {
  try {
    const skip = (page - 1) * limit;

    const filter = {};

    if (disciplineName) {
      const discipline = await disciplineRepository.findByName(disciplineName);
      if (discipline) {
        filter.discipline = discipline._id;
      }
    }
    if (searchTerm) {
      filter.name = { $regex: new RegExp(searchTerm, "i") };
    }

    const objects = await Object.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("discipline", "name")
      .populate("createdBy", "firstName lastName username");

    const totalObjects = await objectRepository.countObjects(filter);

    const disciplines = await disciplineRepository.findAllDisciplines();

    return {
      objects,
      pagination: {
        totalObjects,
        currentPage: page,
        totalPages: Math.ceil(totalObjects / limit),
      },
      filters: {
        disciplines: disciplines.map((d) => ({ id: d._id, name: d.name })),
      },
    };
  } catch (error) {
    console.error("Error en getAllObjects:", error);
    throw error;
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
