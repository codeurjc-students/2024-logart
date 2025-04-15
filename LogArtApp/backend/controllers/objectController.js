const objectService = require("../services/objectService");
const userService = require("../services/userService");
const socketUtils = require("../utils/socketUtils");

/**
 * @swagger
 * tags:
 *   name: Objetos
 *   description: Operaciones relacionadas con la gestión de objetos
 */

/**
 * @swagger
 * /objects:
 *   post:
 *     summary: Crear un nuevo objeto
 *     tags: [Objetos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Objeto de Ejemplo"
 *               description:
 *                 type: string
 *                 example: "Descripción del objeto de ejemplo."
 *               disciplineName:
 *                 type: string
 *                 example: "Canciones"
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del objeto
 *     responses:
 *       201:
 *         description: Objeto creado exitosamente
 *         headers:
 *           Location:
 *             description: URL del nuevo objeto
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateObjectResponse'
 *       400:
 *         description: Error, solicitud incorrecta o datos faltantes
 *       404:
 *         description: Error, disciplina no encontrada
 *       500:
 *         description: Error interno del servidor
 */
const createObject = async (req, res) => {
  try {
    const { name, description, disciplineName } = req.body;
    const userId = req.user.userId;
    const baseUrl = process.env.BASE_URL;
    if (!req.file) {
      return res
        .status(400)
        .json({ error: true, message: "Image is required" });
    }
    const imageUrl = `${baseUrl}/public/images/objects/${req.file.filename}`;
    const newObject = await objectService.createObject(
      { name, description, disciplineName, imageUrl },
      userId,
      baseUrl
    );
    return res
      .status(201)
      .location(`/api/v1/objects/${newObject._id}`)
      .json({ object: newObject, message: "Object created successfully" });
  } catch (error) {
    console.error("Error en createObject:", error);
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
 * /objects/{objectId}:
 *   put:
 *     summary: Actualizar un objeto existente
 *     tags: [Objetos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: objectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del objeto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Objeto Actualizado"
 *               description:
 *                 type: string
 *                 example: "Descripción actualizada del objeto."
 *               disciplineName:
 *                 type: string
 *                 example: "Canciones"
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen del objeto
 *     responses:
 *       200:
 *         description: Objeto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateObjectResponse'
 *       400:
 *         description: Error, solicitud incorrecta, datos faltantes o formato de ID inválido
 *       403:
 *         description: Error, no autorizado para actualizar este objeto
 *       404:
 *         description: Error, objeto o disciplina no encontrada
 *       500:
 *         description: Error interno del servidor
 */
const updateObject = async (req, res) => {
  try {
    const { objectId } = req.params;
    const { name, description, disciplineName } = req.body;
    const userId = req.user.userId;
    let imageUrl;
    if (req.file) {
      imageUrl = `${process.env.BASE_URL}/public/images/objects/${req.file.filename}`;
    }
    const updatedObject = await objectService.updateObject(
      objectId,
      { name, description, disciplineName, imageUrl },
      userId
    );
    return res
      .status(200)
      .json({ object: updatedObject, message: "Object updated successfully" });
  } catch (error) {
    console.error("Error en updateObject:", error);
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
 * /objects/{objectId}:
 *   delete:
 *     summary: Eliminar un objeto por su ID
 *     tags: [Objetos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: objectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del objeto a eliminar
 *     responses:
 *       200:
 *         description: Objeto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteObjectResponse'
 *       400:
 *         description: Error, formato de ID de objeto inválido
 *       403:
 *         description: Error, no autorizado para eliminar este objeto
 *       404:
 *         description: Error, objeto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
const deleteObject = async (req, res) => {
  try {
    const { objectId } = req.params;
    const userId = req.user.userId;
    const result = await objectService.deleteObject(objectId, userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en deleteObject:", error);
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
 * /objects/{disciplineName}:
 *   get:
 *     summary: Obtener la galería de objetos por disciplina
 *     tags: [Objetos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: disciplineName
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la disciplina
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filtrar objetos por ID de usuario
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
 *         description: Número de objetos por página
 *       - in: query
 *         name: objectName
 *         schema:
 *           type: string
 *         description: Filtrar objetos por nombre
 *     responses:
 *       200:
 *         description: Galería de objetos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetGalleryByDisciplineResponse'
 *       404:
 *         description: Error, disciplina no encontrada
 *       500:
 *         description: Error interno del servidor
 */
const getGalleryByDiscipline = async (req, res) => {
  try {
    const { disciplineName } = req.params;
    const query = req.query;
    const gallery = await objectService.getGalleryByDiscipline(
      disciplineName,
      query
    );
    return res.status(200).json(gallery);
  } catch (error) {
    console.error("Error en getGalleryByDiscipline:", error);
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
 * /objects/details/{objectId}:
 *   get:
 *     summary: Obtener detalles de un objeto por su ID
 *     tags: [Objetos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: objectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del objeto a buscar
 *     responses:
 *       200:
 *         description: Detalles del objeto obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetObjectByIdResponse'
 *       400:
 *         description: Error, formato de ID de objeto inválido
 *       403:
 *         description: Error, no autorizado para ver este objeto
 *       404:
 *         description: Error, objeto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
const getObjectById = async (req, res) => {
  try {
    const { objectId } = req.params;
    const userId = req.user.userId;
    const object = await objectService.getObjectById(objectId, userId);
    return res.status(200).json({ object });
  } catch (error) {
    console.error("Error en getObjectById:", error);
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
 * /objects/{objectId}/toggle-public-share:
 *   post:
 *     summary: Alternar la opción de compartir públicamente un objeto
 *     tags: [Objetos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: objectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del objeto al que se alternará la opción de compartir públicamente
 *     responses:
 *       200:
 *         description: Alternado exitosamente la opción de compartir públicamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       400:
 *         description: Solicitud incorrecta o datos faltantes
 *       500:
 *         description: Error interno del servidor
 */
const togglePublicShare = async (req, res) => {
  try {
    const { objectId } = req.params;
    const userId = req.user.userId;
    const result = await objectService.togglePublicShare(objectId, userId);
    if (result.isPubliclyShared) {
      try {
        const user = await userService.getUserById(userId);
        const object = await objectService.getObjectById(objectId, userId);
        const notification = {
          type: "object_shared",
          objectId: objectId,
          objectName: object.name,
          userId: userId,
          userName: `${user.firstName} ${user.lastName}`,
          timestamp: new Date(),
        };
        socketUtils.notifyAdmins(req, notification);
      } catch (notifyError) {
        console.error("Error al notificar a los administradores:", notifyError);
      }
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en togglePublicShare:", error);
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
 * /objects/public/{shareId}:
 *   get:
 *     summary: Obtener un objeto público a partir de su ID compartido
 *     tags: [Objetos]
 *     parameters:
 *       - in: path
 *         name: shareId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID compatida pública del objeto
 *     responses:
 *       200:
 *         description: Objeto público obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 object:
 *                   type: object
 *       404:
 *         description: Objeto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
const getPublicObject = async (req, res) => {
  try {
    const { shareId } = req.params;
    const object = await objectService.getObjectByPublicShareId(shareId);
    return res.status(200).json({ object });
  } catch (error) {
    console.error("Error en getPublicObject:", error);
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
 * /objects/{objectId}/favorite:
 *   post:
 *     summary: Alternar el estado de favorito de un objeto
 *     tags: [Objetos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: objectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del objeto al que se alternará el estado de favorito
 *     responses:
 *       200:
 *         description: Estado de favorito actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isFavorite:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Objeto añadido a favoritos"
 *       500:
 *         description: Error interno del servidor
 */
const toggleFavorite = async (req, res) => {
  try {
    const { objectId } = req.params;
    const userId = req.user.userId;
    const result = await userService.toggleObjectFavorite(userId, objectId);
    return res.status(200).json({
      isFavorite: result.isFavorite,
      message: result.isFavorite
        ? "Objeto añadido a favoritos"
        : "Objeto eliminado de favoritos",
    });
  } catch (error) {
    console.error("Error al cambiar estado de favorito:", error);
    if (
      error.message.includes("format") ||
      error.message.includes("not found")
    ) {
      return res.status(404).json({ error: true, message: error.message });
    }
    return res
      .status(500)
      .json({ error: true, message: "Error interno del servidor" });
  }
};

module.exports = {
  createObject,
  updateObject,
  deleteObject,
  getGalleryByDiscipline,
  getObjectById,
  togglePublicShare,
  getPublicObject,
  toggleFavorite,
};
