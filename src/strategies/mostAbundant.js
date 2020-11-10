const ProductLocationQuantity = require("../utils/product-location-quantity");

/**
 * Function/ that computes from which location each product should be taken, considering the quantity of that product
 * (take each product from the location which has the largest stock for that particular product)
 * @param {{address:{streetAddress: string, county: string, city: string},
 *          productIdsAndQuantities: Object.<string, number>,
 *          timestamp: string}} order information about the order
 * @param {Array.<LocationWithAllStock>} locationsWithStock the array containing all locations paired with their respective list of
 * stocks
 * @returns {Promise.<Array.<ProductLocationQuantity>, string>} a promise containing for each product id from the order
 * the id of the location from which the product is taken and the quantity that is taken
 */
exports.run = (order, locationsWithStock) => {
  return new Promise((resolve, reject) => {
    const productIdsAndQuantities = order.productIdsAndQuantities;
    if (locationsWithStock.length === 0) {
      reject("There are no locations.");
    }

    const results = {};
    for (const [key] of Object.entries(productIdsAndQuantities)) {
      results[key] = new ProductLocationQuantity(parseInt(key), -1, 0);
    }

    for (const locationWithStock of locationsWithStock) {
      for (const stock of locationWithStock.stockList) {
        if (
          Object.prototype.hasOwnProperty.call(results, stock._id.product) &&
          stock.quantity > results[stock._id.product].quantity
        ) {
          results[stock._id.product].locationId =
            locationWithStock.location._id;
          results[stock._id.product].quantity = stock.quantity;
        }
      }
    }

    for (const [key, value] of Object.entries(productIdsAndQuantities)) {
      if (results[key].quantity < value) {
        reject(
          "Could not find a suitable set of locations due to insufficient stock!"
        );
      } else {
        results[key].quantity = value;
      }
    }
    resolve(Object.values(results));
  });
};
