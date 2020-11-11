const joi = require("joi");

async function validateOrder(order) {
  const schema = joi
    .object({
      productIdsAndQuantities: joi.any(),
      timestamp: joi.date().less("now").required(),
      address: joi.object({
        country: joi.string().max(100).required(),
        county: joi.string().max(100).required(),
        city: joi.string().max(100).required(),
        streetAddress: joi.string().max(100).required(),
      }),
    })
    .unknown();

  return schema.validateAsync(order, { abortEarly: false });
}

exports.validateOrder = validateOrder;
