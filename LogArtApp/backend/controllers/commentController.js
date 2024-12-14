const commentService = require("../services/commentService");

/**
 * @swagger
 * tags:
 *   name: Comentarios
 *   description: Operaciones relacionadas con la gestión de comentarios
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Crear un nuevo comentario
 *     tags: [Comentarios]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentRequest'
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
 *         headers:
 *           Location:
 *             description: URL del nuevo comentario
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateCommentResponse'
 *       400:
 *         description: Error, solicitud incorrecta o datos faltantes
 *       403:
 *         description: Error, no autorizado para comentar en este objeto
 *       404:
 *         description: Error, objeto o usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
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

/**
 * @swagger
 * /comments/{commentId}:
 *   put:
 *     summary: Actualizar un comentario existente
 *     tags: [Comentarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comentario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCommentRequest'
 *     responses:
 *       200:
 *         description: Comentario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateCommentResponse'
 *       400:
 *         description: Error, solicitud incorrecta o formato de ID inválido
 *       403:
 *         description: Error, no autorizado para actualizar este comentario
 *       404:
 *         description: Error, comentario o usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
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
    return res.status(200).json({
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

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Eliminar un comentario por su ID
 *     tags: [Comentarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comentario a eliminar
 *     responses:
 *       200:
 *         description: Comentario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteCommentResponse'
 *       400:
 *         description: Error, formato de ID de comentario inválido
 *       403:
 *         description: Error, no autorizado para eliminar este comentario
 *       404:
 *         description: Error, comentario o usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
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

/**
 * @swagger
 * /comments/{objectId}:
 *   get:
 *     summary: Obtener comentarios por ID de objeto
 *     tags: [Comentarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: objectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del objeto para el cual se desean obtener los comentarios
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 3
 *         description: Número de comentarios por página
 *       - in: query
 *         name: commentId
 *         schema:
 *           type: string
 *         description: ID específico de un comentario para obtener detalles
 *     responses:
 *       200:
 *         description: Lista de comentarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetCommentsByObjectIdResponse'
 *       400:
 *         description: Error, formato de ID de objeto o comentario inválido
 *       403:
 *         description: Error, no autorizado para ver comentarios de este objeto
 *       404:
 *         description: Error, objeto o comentario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
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
