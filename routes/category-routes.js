const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category-controller');

router.get('/', categoryController.getCategories);

module.exports = router;