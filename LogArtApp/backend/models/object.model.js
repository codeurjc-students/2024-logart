const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ObjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  imageUrl: {
    type: String,
    default: "",
  },
  discipline: {
    type: Schema.Types.ObjectId,
    ref: "Discipline",
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Object", ObjectSchema);
