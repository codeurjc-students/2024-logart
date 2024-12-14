const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  object: {
    type: Schema.Types.ObjectId,
    ref: "Object",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isEditedByAdmin: {
    type: Boolean,
    default: false,
  },
  editedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
