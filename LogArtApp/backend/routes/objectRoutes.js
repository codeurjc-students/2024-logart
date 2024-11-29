const express = require('express');
const { createObject, updateObject, deleteObject, getGalleryByDiscipline } = require('../controllers/objectController');
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadImgMiddleware');
const router = express.Router();

router.post('/', verifyToken, upload.single('imageUrl') , createObject);
router.put('/:objectId', verifyToken, upload.single('imageUrl') ,updateObject);
router.delete('/:objectId', verifyToken, deleteObject);
router.get('/:disciplineName', verifyToken, getGalleryByDiscipline);


module.exports = router;