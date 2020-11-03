const express = require('express');
const router = express.Router();
const orderController = require('../controller/order-controller.js')

router.post('/', orderController.addOrder);

module.exports = router;