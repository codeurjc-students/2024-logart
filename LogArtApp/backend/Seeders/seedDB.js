const mongoose = require('mongoose');

const seedDisciplines = require('./seedDisciplines');
const seedUsers = require('./seedUsers');
const seedAdmins = require('./seedAdmins');
const seedObjects = require('./seedObjects');
const seedComments = require('./seedComments');
const dropDatabase = require('./dropDatabase');

const seedDB = async () => {
  try {
    await dropDatabase();
    await seedDisciplines();
    await seedUsers();
    await seedAdmins();
    await seedObjects();
    await seedComments();

  } catch (error) {
    console.error('Error seeding the database:', error);
    process.exit(1);
  }
};

module.exports = seedDB;
