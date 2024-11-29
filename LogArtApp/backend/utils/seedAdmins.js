const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const seedAdmins = async () => {
  try {
    const admins = [
      { username: 'admin', password: 'admin123', email: 'admin@gmail.com', firstName: 'Admin', lastName: 'Admin', role: 'admin',isVerified: true },
      { username: 'admin2', password: 'admin123', email: 'admin2@gmail.com', firstName: 'admin2', lastName: 'admin2', role: 'admin',isVerified: true },
    ];

    for (const admin of admins) {
      const existingAdmin = await User.findOne({ email: admin.email });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        const newAdmin = new User({ ...admin, password: hashedPassword });
        await newAdmin.save();
        console.log(`Admin created: ${admin.username}`);
      } else {
        console.log(`Admin ${admin.username} already exists`);
      }
    }

    console.log('Admins seeded successfully');
  } catch (error) {
    console.error('Error seeding admins:', error);
    process.exit(1);
  }
};

module.exports = seedAdmins;
