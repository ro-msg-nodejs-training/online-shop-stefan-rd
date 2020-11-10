const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order-controller.js");

router.post("/", orderController.addOrder);

module.exports = router;
