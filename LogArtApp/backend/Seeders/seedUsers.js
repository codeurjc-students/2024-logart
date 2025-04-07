const mongoose = require("mongoose");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const seedUsers = async () => {
  try {
    const users = [
      {
        username: "john_doe",
        password: "hola123",
        email: "pepe@gmail.com",
        firstName: "John",
        lastName: "Doe",
        bio: "Apasionado por los libros y la música.",
        role: "user",
        isVerified: true,
        verificationToken: null,
      },
      {
        username: "jane_smith",
        password: "hola123",
        email: "pepa@gmail.com",
        firstName: "Jane",
        lastName: "Smith",
        bio: "Amante de los videojuegos y la tecnología.",
        role: "user",
        isVerified: true,
        verificationToken: null,
      },
      {
        username: "notverified",
        password: "hola123",
        email: "notverified@gmail.com",
        firstName: "Bob",
        lastName: "Jones",
        bio: "Amante de la moda y la moda.",
        role: "user",
        isVerified: false,
        verificationToken: null,
      },
      {
        username: "old_user1",
        password: "hola123",
        email: "olduser1@example.com",
        firstName: "Old",
        lastName: "User",
        bio: "Un usuario antiguo.",
        role: "user",
        isVerified: true,
        verificationToken: null,
        createdAt: new Date("2025-03-28T10:00:00Z"),
      },
      {
        username: "old_user2",
        password: "hola123",
        email: "olduser2@example.com",
        firstName: "Ol2",
        lastName: "User",
        bio: "Un usuario antiguo.",
        role: "user",
        isVerified: true,
        verificationToken: null,
        createdAt: new Date("2025-04-01T10:00:00Z"),
      },
      {
        username: "old_user3",
        password: "hola123",
        email: "olduser3@example.com",
        firstName: "Ol3",
        lastName: "User",
        bio: "Un usuario antiguo.",
        role: "user",
        isVerified: true,
        verificationToken: null,
        createdAt: new Date("2025-03-01T10:00:00Z"),
      },
      {
        username: "old_user4",
        password: "hola123",
        email: "olduser4@example.com",
        firstName: "Ol4",
        lastName: "User",
        bio: "Un usuario antiguo.",
        role: "user",
        isVerified: true,
        verificationToken: null,
        createdAt: new Date("2025-03-22T10:00:00Z"),
      },
      {
        username: "old_user5",
        password: "hola123",
        email: "olduser5@example.com",
        firstName: "Ol5",
        lastName: "User",
        bio: "Un usuario antiguo.",
        role: "user",
        isVerified: true,
        verificationToken: null,
        createdAt: new Date("2025-03-21T10:00:00Z"),
      },
      {
        username: "old_user6",
        password: "hola123",
        email: "olduser6@example.com",
        firstName: "Ol6",
        lastName: "User",
        bio: "Un usuario antiguo.",
        role: "user",
        isVerified: true,
        verificationToken: null,
        createdAt: new Date("2025-03-27T10:00:00Z"),
      },
      {
        username: "old_user7",
        password: "hola123",
        email: "olduser7@example.com",
        firstName: "Ol7",
        lastName: "User",
        bio: "Un usuario antiguo.",
        role: "user",
        isVerified: true,
        verificationToken: null,
        createdAt: new Date("2025-03-28T10:00:00Z"),
      },
      {
        username: "old_user8",
        password: "hola123",
        email: "olduser8@example.com",
        firstName: "Ol8",
        lastName: "User",
        bio: "Un usuario antiguo.",
        role: "user",
        isVerified: true,
        verificationToken: null,
        createdAt: new Date("2025-03-01T10:00:00Z"),
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
    console.log("Users seeded successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

module.exports = seedUsers;
