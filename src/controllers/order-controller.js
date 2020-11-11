const orderService = require("../services/order-service");
const HttpError = require("../utils/http-error");

exports.addOrder = async (req, res) => {
  try {
    const savedOrder = await orderService.addOrder(req);
    res.status(200).json(savedOrder);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send(error.stack);
    } else {
      res.status(500).send(error.stack);
    }
  }
};
