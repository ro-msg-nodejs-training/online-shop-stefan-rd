const StockModel = require("../data/database/models/stock");
const stockMapper = require("../mappers/stock-mapper");

exports.addStock = (req, res) => {
  stockMapper
    .mapRequestBodyToStockModel(req.body)
    .then((stockModel) => stockModel.save())
    .then((savedStock) => res.status(200).json(savedStock))
    .catch((error) => res.status(500).send(error.toString()));
};

exports.deleteAllStock = (_req, res) => {
  StockModel.deleteMany({}).then(() =>
    res.status(200).send("All stocks removed.")
  );
};

exports.getAllStock = (_req, res) => {
  StockModel.find({}).then((stockList) => res.status(200).json(stockList));
};
