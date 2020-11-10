const StockModel = require("../data/database/models/stock");
const HttpError = require("../utils/http-error");
const joi = require("joi");

exports.mapRequestBodyToStockModel = async (requestBody) => {
  const { error } = await validateStock(requestBody);
  if (error) {
    throw new HttpError(error.message, 400);
  }
  return new StockModel({
    _id: {
      location: requestBody.locationId,
      product: requestBody.productId,
    },
    quantity: requestBody.quantity,
  });
};

async function validateStock(stock) {
  const schema = joi.object({
    productId: joi.number().integer().positive().required(),
    locationId: joi.number().integer().positive().required(),
    quantity: joi.number().integer().min(0).required(),
  });

  return await schema.validateAsync(stock, { abortEarly: false });
}

exports.validateStock = validateStock;
