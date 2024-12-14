const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DisciplineSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["Libros", "Canciones", "Videojuegos"],
  },
  description: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Discipline", DisciplineSchema);
