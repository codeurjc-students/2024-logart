const mongoose = require("mongoose");
const ObjectModel = require("../models/object.model");
const Discipline = require("../models/discipline.model");
const User = require("../models/user.model");

const seedObjects = async () => {
  try {
    const disciplines = await Discipline.find({});
    const users = await User.find({ role: "user" });
    const admins = await User.find({ role: "admin" });
    if (disciplines.length === 0 || users.length === 0) {
      console.log(
        "Ensure that disciplines and users are seeded before seeding objects."
      );
      return;
    }
    const objects = [
      {
        name: "Cien Años de Soledad",
        description: "Una novela clásica de Gabriel García Márquez.",
        imageUrl: "public/images/objects/cien_años.jpg",
        discipline: disciplines.find((d) => d.name === "Libros")._id,
        createdBy: users[0]._id,
      },
      {
        name: "Bohemian Rhapsody",
        description: "Canción icónica de Queen.",
        imageUrl: "public/images/objects/bohemian_rhapsody.jpg",
        discipline: disciplines.find((d) => d.name === "Canciones")._id,
        createdBy: users[1]._id,
      },
      {
        name: "The Legend of Zelda",
        description: "Un famoso videojuego de aventura.",
        imageUrl: "public/images/objects/zelda.jpg",
        discipline: disciplines.find((d) => d.name === "Videojuegos")._id,
        createdBy: users[0]._id,
      },
      {
        name: "The Legend of Zelda 2",
        description: "Un famoso videojuego de aventura.",
        imageUrl: "public/images/objects/zelda.jpg",
        discipline: disciplines.find((d) => d.name === "Videojuegos")._id,
        createdBy: admins[0]._id,
      },
      {
        name: "The Legend of Zelda 3",
        description: "Un famoso videojuego de aventura.",
        imageUrl: "public/images/objects/zelda.jpg",
        discipline: disciplines.find((d) => d.name === "Videojuegos")._id,
        createdBy: admins[1]._id,
      },
    ];
    for (const objectData of objects) {
      const exist = await ObjectModel.findOne({ name: objectData.name });
      if (!exist) {
        await ObjectModel.create(objectData);
        console.log(`Object created: ${objectData.name}`);
      } else {
        console.log(`Object ${objectData.name} already exists`);
      }
    }
    console.log("Objects seeded successfully");
  } catch (error) {
    console.error("Error seeding objects:", error);
    process.exit(1);
  }
};

module.exports = seedObjects;
