const StockModel = require("../data/database/models/stock");
const Validator = require("../utils/validation-util");

const convertRequestBodyToStockModel = (requestBody) => {
  return new Promise((resolve, reject) => {
    Validator.validateId(requestBody.productId)
      .then(() => Validator.validateId(requestBody.locationId))
      .then(() => {
        if (
          Number.isInteger(requestBody.quantity) === true &&
          parseInt(requestBody.quantity) >= 0
        ) {
          resolve(
            new StockModel({
              _id: {
                location: requestBody.locationId,
                product: requestBody.productId,
              },
              quantity: requestBody.quantity,
            })
          );
        }
        reject("Quantity must be a positive integer.");
      })
      .catch((error) => reject(error));
  });
};

exports.addStock = (req, res) => {
  convertRequestBodyToStockModel(req.body)
    .then((stockModel) => stockModel.save())
    .then((savedStock) => res.status(200).json(savedStock))
    .catch((error) => res.status(500).send(error.toString()));
};

exports.deleteAllStock = (_req, res) => {
  StockModel.deleteMany({}).then(() =>
    res.status(200).send("All stock removed.")
  );
};

exports.getAllStock = (_req, res) => {
  StockModel.find({}).then((stockList) => res.status(200).json(stockList));
};
