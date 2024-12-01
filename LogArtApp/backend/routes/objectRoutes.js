const express = require('express');
const { createObject, updateObject, deleteObject, getGalleryByDiscipline, getObjectById } = require('../controllers/objectController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { uploadObject, uploadProfile } = require('../middlewares/uploadImgMiddleware');
const router = express.Router();

router.post('/', verifyToken, uploadObject.single('imageUrl') , createObject);
router.put('/:objectId', verifyToken, uploadObject.single('imageUrl') ,updateObject);
router.delete('/:objectId', verifyToken, deleteObject);
router.get('/details/:objectId', verifyToken, getObjectById);
router.get('/:disciplineName', verifyToken, getGalleryByDiscipline);
router.get('/details/:objectId', verifyToken, getObjectById);


module.exports = router;