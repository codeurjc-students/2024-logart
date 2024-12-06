const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const seedUsers = async () => {
  try {
    const users = [
      {
        username: 'john_doe',
        password: 'hola123',
        email: 'pepe@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Apasionado por los libros y la música.',
        role: 'user',
        isVerified: true,
        verificationToken: null,
      },
      {
        username: 'jane_smith',
        password: 'hola123',
        email: 'pepa@gmail.com',
        firstName: 'Jane',
        lastName: 'Smith',
        bio: 'Amante de los videojuegos y la tecnología.',
        role: 'user',
        isVerified: true,
        verificationToken: null,
      },
    ];

    for (const userData of users) {
      const exist = await User.findOne({ email: userData.email });
      if (!exist) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        userData.password = hashedPassword;

        await User.create(userData);
        console.log(`User created: ${userData.email}`);
      } else {
        console.log(`User ${userData.email} already exists`);
      }
    }
    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

module.exports = seedUsers;
