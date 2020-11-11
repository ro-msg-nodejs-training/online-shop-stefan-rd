const ProductModel = require("../data/database/models/product");
const joi = require("joi");
const HttpError = require("../utils/http-error");

exports.mapRequestBodyToProductModel = async (requestBody) => {
  const { error } = await validateProduct(requestBody);
  if (error) {
    throw new HttpError(error.message, 400);
  }
  return new ProductModel({
    _id: parseInt(requestBody.id),
    name: requestBody.name,
    description: requestBody.description,
    price: parseFloat(requestBody.price),
    weight: parseFloat(requestBody.weight),
    category: requestBody.categoryId,
    supplier: requestBody.supplierId,
    imageUrl: requestBody.imageUrl,
  });
};

async function validateProduct(product) {
  const schema = joi.object({
    id: joi.number().integer().positive().required(),
    categoryId: joi.number().integer().positive().required(),
    name: joi.string().max(100).required(),
    description: joi.string().max(500),
    price: joi.number().positive().required(),
    weight: joi.number().positive().required(),
    supplierId: joi.number().integer().positive().required(),
    imageUrl: joi.string().max(500),
  });

  return schema.validateAsync(product, { abortEarly: false });
}

exports.validateProduct = validateProduct;
