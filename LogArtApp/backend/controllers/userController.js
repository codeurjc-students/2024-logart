const User = require('../models/user.model');
const mongoose = require('mongoose');

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
    if (userIdFromParams !== userIdFromToken) {
      return res.status(401).json({ error: true, message: 'Unauthorized' });
    }

    if (!mongoose.Types.ObjectId.isValid(userIdFromParams)) {
      return res.status(400).json({ error: true, message: 'Invalid user ID format' });
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

module.exports = {
  allUsers, 
  findUserById
};
  