const stockMapper = require("../mappers/stock-mapper");
const StockModel = require("../data/database/models/stock");

exports.addStock = async (requestBody) => {
  const stockModel = await stockMapper.mapRequestBodyToStockModel(requestBody);
  return await stockModel.save();
};

exports.deleteAllStocks = async () => {
  return await StockModel.deleteMany({});
};

exports.getAllStocks = async () => {
  return await StockModel.find({});
};
