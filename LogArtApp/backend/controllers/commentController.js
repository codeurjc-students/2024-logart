const Comment = require('../models/comment.model');
const Object = require('../models/object.model');
const User = require('../models/user.model');

const createComment = async (req, res) => {
  try {
    const { content, objectId } = req.body;
    const user = await User.findById(req.user.userId);
    const userRole = user.role;
    

    if (!content || !objectId) {
      return res.status(400).json({ error: true, message: 'Both content and object Id are required' });
    }

    const object = await Object.findById(objectId);

    if (req.user.userId !== object.createdBy.toString() && userRole !== 'admin') {
      return res.status(403).json({ error: true, message: 'You are not authorized to comment on this object' });
    }

    if (!object) {
      return res.status(404).json({ error: true, message: 'Object not found' });
    }

    const newComment = new Comment({
      content,
      object: objectId,
      user: req.user.userId,
    });

    await newComment.save();

    return res.status(201).location(`/api/v1/comments/${object._id}/${newComment._id}`).json({ comment: newComment, message: 'Comment created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

module.exports = { createComment };