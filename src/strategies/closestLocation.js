const axios = require("axios");
const HttpError = require("../utils/http-error");
const ProductLocationQuantity = require("../utils/product-location-quantity");
const routeMatrixUrl =
  "http://www.mapquestapi.com/directions/v2/routematrix?key=";

/**
 * Function that computes from which location each product should be taken, considering the distance from that location to the
 * delivery address
 * @param {{address:{streetAddress: string, county: string, city: string},
 *          productIdsAndQuantities: Object.<string, number>,
 *          timestamp: string}} order information about the order
 * @param {Array.<LocationWithAllStock>} locationsWithStock the array containing all locations paired with their respective list of
 * stocks
 * @returns {Promise.<Array.<ProductLocationQuantity>, string>} a promise containing for each product id from the order
 * the id of the location from which the product is taken and the quantity that is taken
 */
exports.run = async (order, locationsWithStock) => {
  const productIdsAndQuantities = order.productIdsAndQuantities;

  if (locationsWithStock.length === 0) {
    throw new HttpError("There are no locations stored in the database.", 404);
  }

  let results = {};
  for (const [key, value] of Object.entries(productIdsAndQuantities)) {
    results[key] = new ProductLocationQuantity(parseInt(key), -1, value);
  }

  let locationsWithStockAndAddress = [];
  for (const locationWithStock of locationsWithStock) {
    locationsWithStockAndAddress.push({
      location: locationWithStock.location,
      stockList: locationWithStock.stockList,
      address: locationWithStock.location.address,
    });
  }
  locationsWithStockAndAddress.unshift({
    location: null,
    stockList: null,
    address: order.address,
  });
  locationsWithStockAndAddress = locationsWithStockAndAddress.map(
    (locationWithStockAndAddress) => {
      return {
        location: locationWithStockAndAddress.location,
        stockList: locationWithStockAndAddress.stockList,
        address:
          locationWithStockAndAddress.address.streetAddress +
          ", " +
          locationWithStockAndAddress.address.city +
          ", " +
          locationWithStockAndAddress.address.county,
      };
    }
  );
  let addresses = locationsWithStockAndAddress.map(
    (location) => location.address
  );

  const routeMatrixReponse = await axios.post(
    routeMatrixUrl + process.env.MAPQUEST_API_KEY,
    {
      locations: addresses,
      options: {
        allToAll: false,
      },
    }
  );

  let distances = routeMatrixReponse.data.distance;
  for (let i = 0; i < locationsWithStockAndAddress.length; i++) {
    locationsWithStockAndAddress[i].distance = distances[i];
  }
  locationsWithStockAndAddress.shift();
  locationsWithStockAndAddress.sort((a, b) => a.distance - b.distance);
  for (const [key, value] of Object.entries(productIdsAndQuantities)) {
    for (const locationWithStockAndAddress of locationsWithStockAndAddress) {
      let stockForProduct = locationWithStockAndAddress.stockList.find(
        (element) => {
          return element._id.product === parseInt(key);
        }
      );
      if (stockForProduct !== undefined && stockForProduct.quantity >= value) {
        results[key].locationId = stockForProduct._id.location;
        break;
      }
    }
  }

  results = Object.values(results);
  if (results.some((element) => element.locationId === -1)) {
    throw new HttpError(
      "Could not find a suitable set of locations due to insufficient stock!",
      404
    );
  }
  return results;
};
