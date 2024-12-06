const objectService = require("../services/objectService");

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
