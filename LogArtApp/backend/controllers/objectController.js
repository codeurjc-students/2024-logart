const objectService = require("../services/objectService");

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

module.exports = {
  createObject,
  updateObject,
  deleteObject,
  getGalleryByDiscipline,
  getObjectById,
};
