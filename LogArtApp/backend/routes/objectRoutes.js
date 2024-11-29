const express = require('express');
const { createObject, updateObject, deleteObject } = require('../controllers/objectController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', verifyToken, createObject);
router.put('/:objectId', verifyToken, updateObject);
router.delete('/:objectId', verifyToken, deleteObject);


module.exports = router;