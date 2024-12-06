const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const seedAdmins = async () => {
  try {
    const admins = [
      {
        username: 'admin_one',
        password: 'admin123',
        email: 'admin@gmail.com',
        firstName: 'Admin',
        lastName: 'One',
        bio: 'Administrador principal.',
        role: 'admin',
        isVerified: true,
        verificationToken: null,
      },
      {
        username: 'admin_two',
        password: 'admin123',
        email: 'admin2@example.com',
        firstName: 'Admin',
        lastName: 'Two',
        bio: 'Administrador secundario.',
        role: 'admin',
        isVerified: true,
        verificationToken: null,
      },
    ];

    for (const adminData of admins) {
      const exist = await User.findOne({ email: adminData.email });
      if (!exist) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);
        adminData.password = hashedPassword;

        await User.create(adminData);
        console.log(`Admin created: ${adminData.email}`);
      } else {
        console.log(`Admin ${adminData.email} already exists`);
      }
    }
    console.log('Admins seeded successfully');
  } catch (error) {
    console.error('Error seeding admins:', error);
    process.exit(1);
  }
};

module.exports = seedAdmins;
