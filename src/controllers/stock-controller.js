const HttpError = require("../utils/http-error");
const stockService = require("../services/stock-service");

exports.addStock = async (req, res) => {
  try {
    const savedStock = await stockService.addStock(req);
    res.status(200).json(savedStock);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send(error.stack);
    } else {
      res.status(500).send(error.stack);
    }
  }
};

exports.deleteAllStock = async (_req, res) => {
  try {
    await stockService.deleteAllStock();
    res.status(200).json("Successfully deleted all stocks.");
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send(error.stack);
    } else {
      res.status(500).send(error.stack);
    }
  }
};

exports.getAllStock = async (_req, res) => {
  try {
    const stocks = await stockService.getAllStocks();
    res.status(200).json(stocks);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send(error.stack);
    } else {
      res.status(500).send(error.stack);
    }
  }
};
