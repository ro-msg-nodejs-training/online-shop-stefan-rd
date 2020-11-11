const stockMapper = require("../mappers/stock-mapper");
const StockModel = require("../data/database/models/stock");

exports.addStock = async (req) => {
  const stockModel = await stockMapper.mapRequestBodyToStockModel(req.body);
  return stockModel.save();
};

exports.deleteAllStocks = async () => {
  return StockModel.deleteMany({});
};

exports.getAllStocks = async () => {
  return StockModel.find({});
};
