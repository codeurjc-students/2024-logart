const User = require("../models/user.model");
const Object = require("../models/object.model");
const Discipline = require("../models/discipline.model");
const Comment = require("../models/comment.model");

const dropDatabase = async () => {
  try {
    console.log("Dropping the database before starting...");
    await User.deleteMany({});
    await Object.deleteMany({});
    await Discipline.deleteMany({});
    await Comment.deleteMany({});
  } catch (error) {
    console.error("Error dropping the database:", error);
    process.exit(1);
  }
};

module.exports = dropDatabase;
