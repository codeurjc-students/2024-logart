const express = require('express');
const { createObject } = require('../controllers/objectController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', verifyToken, createObject);

module.exports = router;