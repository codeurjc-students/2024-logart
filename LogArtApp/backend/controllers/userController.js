const User = require('../models/user.model');
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
      return res.status(400).json({ error: true, message: 'Invalid object ID format' });
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

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: true, message: 'Invalid user ID format' });
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

    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

module.exports = {
  allUsers, 
  findUserById,
  deleteUser
};
  