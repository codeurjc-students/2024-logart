const commentService = require("../services/commentService");

const createComment = async (req, res) => {
  try {
    const { content, objectId } = req.body;
    const userId = req.user.userId;

    const newComment = await commentService.createComment(
      content,
      objectId,
      userId
    );

    return res
      .status(201)
      .location(`/api/v1/comments/${objectId}/${newComment._id}`)
      .json({ comment: newComment, message: "Comment created successfully" });
  } catch (error) {
    console.error("Error en createComment:", error);
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ error: true, message: error.message });
    }
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    const updatedComment = await commentService.updateComment(
      commentId,
      content,
      userId
    );

    return res
      .status(200)
      .json({
        comment: updatedComment,
        message: "Comment updated successfully",
      });
  } catch (error) {
    console.error("Error en updateComment:", error);
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ error: true, message: error.message });
    }
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;

    const result = await commentService.deleteComment(commentId, userId);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en deleteComment:", error);
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ error: true, message: error.message });
    }
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

const getCommentsByObjectId = async (req, res) => {
  try {
    const { objectId } = req.params;
    const query = req.query;
    const userId = req.user.userId;

    const commentsData = await commentService.getCommentsByObjectId(
      objectId,
      query,
      userId
    );

    return res.status(200).json(commentsData);
  } catch (error) {
    console.error("Error en getCommentsByObjectId:", error);
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ error: true, message: error.message });
    }
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByObjectId,
};
