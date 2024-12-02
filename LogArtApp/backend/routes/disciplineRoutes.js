const express = require('express');
const router = express.Router();
const { getAllDisciplines } = require('../controllers/disciplineController');

router.get('/', getAllDisciplines);

module.exports = router;
