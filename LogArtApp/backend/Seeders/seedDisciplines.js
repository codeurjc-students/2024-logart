const mongoose = require('mongoose');
const Discipline = require('../models/discipline.model');

const seedDisciplines = async () => {
  try {
    const disciplines = [
      { name: 'Libros', description: 'Libros que has leído' },
      { name: 'Canciones', description: 'Canciones que has escuchado' },
      { name: 'Videojuegos', description: 'Videojuegos que has jugado' },
    ];

    for (const discipline of disciplines) {
      const exist = await Discipline.findOne({ name: discipline.name });
      if (!exist) {
        await Discipline.create(discipline);
        console.log(`Discipline created: ${discipline.name}`);
      } else {
        console.log(`Discipline ${discipline.name} already exists`);
      }
    }
    console.log('Disciplines seeded successfully');
  } catch (error) {
    console.error('Error seeding disciplines:', error);
    process.exit(1);
  }
};

module.exports = seedDisciplines;
