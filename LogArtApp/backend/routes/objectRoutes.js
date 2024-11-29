const express = require('express');
const { createObject, updateObject } = require('../controllers/objectController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', verifyToken, createObject);
router.put('/:objectId', verifyToken, updateObject);


module.exports = router;