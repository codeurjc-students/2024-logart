const userService = require("../services/userService");

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Operaciones relacionadas con la gestión de usuarios
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios con paginación
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Número de usuarios por página
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AllUsersResponse'
 *       401:
 *         description: Error, Token de autenticación inválido o ausente
 *       500:
 *         description: Error interno del servidor
 */
const allUsers = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const result = await userService.getAllUsers(page, limit);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en allUsers:", error);
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
 * /users/{userId}:
 *   get:
 *     summary: Obtener un usuario por su ID
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a buscar
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FindUserByIdResponse'
 *       400:
 *         description: Error, formato de ID de usuario inválido
 *       401:
 *         description: Error, no autorizado para acceder a este usuario
 *       403:
 *         description: Error, Solo admin puede buscar usuarios
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
const findUserById = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const requestingUserId = req.user.userId;
    const requestingUserProfile = await userService.getUserProfile(
      requestingUserId
    );
    const userRole = requestingUserProfile.user.role;
    if (targetUserId !== requestingUserId && userRole !== "admin") {
      return res.status(401).json({ error: true, message: "Unauthorized" });
    }
    const user = await userService.getUserById(targetUserId);
    return res.status(200).json({ user, message: "User found" });
  } catch (error) {
    console.error("Error en findUserById:", error);
    if (error.message === "Unauthorized") {
      return res.status(401).json({ error: true, message: error.message });
    } else if (error.message === "User not found") {
      return res.status(404).json({ error: true, message: error.message });
    } else if (error.message === "Invalid user ID format") {
      return res.status(400).json({ error: true, message: error.message });
    } else {
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  }
};

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Eliminar un usuario por su ID
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario y datos eliminados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteUserResponse'
 *       400:
 *         description: Error, formato de ID de usuario inválido
 *       401:
 *         description: Error, no autorizado para eliminar este usuario o eliminar cuenta propia
 *       403:
 *         description: Error, token de autenticación inválido o ausente
 *       404:
 *         description: Error, usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.userId;
    const requestingUserProfile = await userService.getUserProfile(
      requestingUserId
    );
    const userRole = requestingUserProfile.user.role;
    if (userRole !== "admin") {
      return res.status(403).json({
        error: true,
        message: "Forbidden: Only admin can delete users",
      });
    }
    if (requestingUserId === userId) {
      return res.status(401).json({
        error: true,
        message:
          "You cannot delete your own account, contact the system administrator",
      });
    }

    const result = await userService.deleteUser(userId, requestingUserId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en deleteUser:", error);
    if (error.message === "Invalid user ID format") {
      return res.status(400).json({ error: true, message: error.message });
    } else if (error.message === "User not found") {
      return res.status(404).json({ error: true, message: error.message });
    } else if (
      error.message ===
      "You cannot delete your own account, contact the system administrator"
    ) {
      return res.status(401).json({ error: true, message: error.message });
    } else {
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  }
};

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Obtener el perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       400:
 *         description: Error, formato de ID de usuario inválido
 *       404:
 *         description: Error, usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await userService.getUserProfile(userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en getUserProfile:", error);
    if (error.message === "User not found") {
      return res.status(404).json({ error: true, message: error.message });
    } else if (error.message === "Invalid user ID format") {
      return res.status(400).json({ error: true, message: error.message });
    } else {
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  }
};

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Actualizar el perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Juan"
 *               lastName:
 *                 type: string
 *                 example: "Pérez"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan.perez@example.com"
 *               username:
 *                 type: string
 *                 example: "juanperez"
 *               bio:
 *                 type: string
 *                 example: "Nueva bio del usuario"
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil del usuario
 *     responses:
 *       200:
 *         description: Perfil del usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserProfileResponse'
 *       400:
 *         description: Formato de ID de usuario inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = req.body;
    const file = req.file;
    const result = await userService.updateUserProfile(
      userId,
      updateData,
      file
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en updateUserProfile:", error);
    if (error.message === "Invalid user ID format") {
      return res.status(400).json({ error: true, message: error.message });
    } else if (error.message === "User not found") {
      return res.status(404).json({ error: true, message: error.message });
    } else {
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  }
};

module.exports = {
  allUsers,
  findUserById,
  deleteUser,
  getUserProfile,
  updateUserProfile,
};
