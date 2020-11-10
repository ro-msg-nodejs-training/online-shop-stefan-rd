const strategyFactory = require("../strategies/strategy");
const OrderModel = require("../data/database/models/order");
const OrderDetailModel = require("../data/database/models/order-detail");
const StockModel = require("../data/database/models/stock");
const LocationModel = require("../data/database/models/location");
const ProductModel = require("../data/database/models/product");
const dotenv = require("dotenv");
dotenv.config();
const strategy = strategyFactory.getStrategy(process.env.STRATEGY);
const LocationWithAllStock = require("../utils/location-stock");
const HttpError = require("../utils/http-error");
const orderMapper = require("../mappers/order-mapper");

exports.addOrder = async (requestBody) => {
  await Promise.all([
    checkIfValidProducts(requestBody.productIdsAndQuantities),
    orderMapper.validateOrder(requestBody),
  ]);

  const locations = await LocationModel.find();
  const locationsWithStocks = await Promise.all(
    locations.map(async (location) => {
      const stocksForLocation = await StockModel.find({
        "_id.location": location._id,
        "_id.product": { $exists: true },
      });
      return new LocationWithAllStock(location, stocksForLocation);
    })
  );

  const strategyResults = await strategy(requestBody, locationsWithStocks);

  const updatedStock = updateStock(strategyResults);
  const savedOrder = await saveOrder(requestBody, strategyResults);
  const savedOrderDetails = saveOrderDetails(savedOrder, strategyResults);
  await Promise.all([updatedStock, savedOrderDetails]);

  return savedOrder;
};

const saveOrderDetails = async (savedOrder, strategyResults) => {
  return Promise.all(
    strategyResults.map(async (strategyResult) => {
      return new OrderDetailModel({
        _id: {
          product: parseInt(strategyResult.productId),
          order: savedOrder._id,
        },
        quantity: strategyResult.quantity,
      }).save();
    })
  );
};

const saveOrder = async (order, strategyResults) => {
  const timestamp = new Date(order.timestamp);
  const address = order.address;
  const shippedFrom = strategyResults[0].locationId;
  const numberOfExistingOrders = await OrderModel.countDocuments({});

  return new OrderModel({
    _id: numberOfExistingOrders + 1,
    shippedFrom: shippedFrom,
    createdAt: timestamp,
    address: address,
  }).save();
};

const updateStock = async (strategyResults) => {
  return Promise.all(
    strategyResults.map(async (strategyResult) => {
      const stock = await StockModel.findOne({
        "_id.location": strategyResult.locationId,
        "_id.product": strategyResult.productId,
      });

      stock.quantity = stock.quantity - strategyResult.quantity;
      return stock.save();
    })
  );
};

const checkIfValidProducts = async (productIdsAndQuantities) => {
  return Promise.all(
    Object.entries(productIdsAndQuantities).map(
      async ([productIdFromOrder]) => {
        const exists = await ProductModel.exists({
          _id: parseInt(productIdFromOrder),
        });

        if (exists === false) {
          throw new HttpError(
            "There is no product with such ID in the database: " +
              productIdFromOrder,
            404
          );
        } else {
          return true;
        }
      }
    )
  );
};
