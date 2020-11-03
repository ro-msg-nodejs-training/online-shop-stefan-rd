const express = require('express');
const router = express.Router();
const stockController = require('../controller/stock-controller.js')

router.post('/', stockController.addStock);

router.delete('/', stockController.deleteAllStock)

router.get('/', stockController.getAllStock)

module.exports = router;