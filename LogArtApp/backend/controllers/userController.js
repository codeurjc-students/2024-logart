const User = require('../models/user.model');
const Object = require('../models/object.model');
const Comment = require('../models/comment.model');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const isValidMongoId = require('../utils/validId');

const allUsers = async (req, res) => {
  try {
    const {page = 1, limit = 5} = req.query;
    const skip = (page - 1) * limit;
    const users = await User.find({},'firstName lastName email username').skip(skip).limit(limit);
    
    const totalUsers = await User.countDocuments();

    return res.status(200).json({ users, totalUsers, currentPage: parseInt(page), totalPages: Math.ceil(totalUsers / limit) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const findUserById = async (req, res) => {
  try {
    const userIdFromParams = req.params.userId;
    const userIdFromToken = req.user.userId;
    
    if (!isValidMongoId(userIdFromParams)) {
      return res.status(400).json({ error: true, message: 'Invalid user ID format' });
    }

    if (userIdFromParams !== userIdFromToken) {
      return res.status(401).json({ error: true, message: 'Unauthorized' });
    }

    const user = await User.findById(userIdFromParams);
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    return res.status(200).json({ user, message: 'User found' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidMongoId(userId)) {
      return res.status(400).json({ error: true, message: 'Invalid object ID format' });
    }
    if (!userId) {
      return res.status(400).json({ error: true, message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    if (req.user.userId === userId) {
      return res.status(401).json({ error: true, message: 'You cannot delete an admin account, contact the system administrator' });
    }

    const userObjects = await Object.find({ createdBy: userId });

    userObjects.forEach(async (object) => {
      if (object.imageUrl) {
        const imagePath = path.join(__dirname, '..', 'public', 'images', path.basename(object.imageUrl));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    });

    

    await Comment.deleteMany({ user: userId });
    await Object.deleteMany({ createdBy: userId }); 
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: 'User and Data deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password -createdAt -hasToken -role -isVerified -verificationToken -__v -_id');

    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!isValidMongoId(userId)) {
      return res.status(400).json({ error: true, message: 'Invalid user ID format' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    const { firstName, lastName, email, username, bio } = req.body;
    if (username) user.username = username;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (bio) user.bio = bio;

    if (req.file) {
  if (user.profileImage && user.profileImage !== '/public/images/profiles/default-profile.png') {
    const oldImagePath = path.join(__dirname, '..', 'public', 'images', 'profiles', path.basename(user.profileImage));
    if (fs.existsSync(oldImagePath)) {
      try {
        fs.unlinkSync(oldImagePath);
      } catch (err) {
        console.error('Error al eliminar la imagen anterior:', err);
        // Opcional: Puedes decidir no devolver un error y continuar con la actualización
      }
    }
  }
  user.profileImage = `/public/images/profiles/${req.file.filename}`;
}


    await user.save();

    return res.status(200).json({ user, message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};
    
    

module.exports = {
  allUsers, 
  findUserById,
  deleteUser, 
  getUserProfile,
  updateUserProfile
};
  