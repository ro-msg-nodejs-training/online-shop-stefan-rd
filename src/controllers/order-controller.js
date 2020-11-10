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

exports.addOrder = (req, res) => {
  checkIfValidProducts(req.body.productIdsAndQuantities)
    .then(() => LocationModel.find({}))
    .then((locations) => {
      return Promise.all(
        locations.map((location) => {
          return StockModel.find({
            "_id.location": location._id,
            "_id.product": { $exists: true },
          }).then((allStockForLocation) => {
            const result = new LocationWithAllStock(
              location,
              allStockForLocation
            );
            return Promise.resolve(result);
          });
        })
      );
    })
    .then((locationsWithStocks) => strategy(req.body, locationsWithStocks))
    .then((strategyResult) => {
      updateStock(strategyResult);
      return strategyResult;
    })
    .then((strategyResult) => {
      return new Promise((resolve) => {
        saveOrder(req.body, strategyResult).then((savedOrder) => {
          resolve({ order: savedOrder, strategyResult: strategyResult });
        });
      });
    })
    .then((savedOrderAndStrategyResult) => {
      return new Promise((resolve) => {
        saveOrderDetails(
          savedOrderAndStrategyResult.order,
          savedOrderAndStrategyResult.strategyResult
        ).then(() => resolve(savedOrderAndStrategyResult.order));
      });
    })
    .then((savedOrder) => res.json(savedOrder))
    .catch((error) => res.status(500).send(error.toString()));
};

const updateStock = (strategyResults) => {
  return Promise.all(
    strategyResults.map((strategyResult) => {
      return StockModel.findOne({
        "_id.location": strategyResult.locationId,
        "_id.product": strategyResult.productId,
      })
        .then((stock) => {
          stock.quantity = stock.quantity - strategyResult.quantity;
          return Promise.resolve(stock);
        })
        .then((updatedStock) => updatedStock.save());
    })
  );
};

const saveOrderDetails = (savedOrder, strategyResults) => {
  return Promise.all(
    strategyResults.map((strategyResult) => {
      //console.log(strategyResult)
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

const saveOrder = (order, strategyResults) => {
  return new Promise((resolve) => {
    const timestamp = new Date(order.timestamp);
    const address = order.address;
    console.log(strategyResults);
    const shippedFrom = strategyResults[0].locationId;

    OrderModel.countDocuments({})
      .then((numberOfOrders) => {
        return new OrderModel({
          _id: numberOfOrders + 1,
          shippedFrom: shippedFrom,
          createdAt: timestamp,
          address: address,
        });
      })
      .then((orderModel) => orderModel.save())
      .then((savedOrder) => {
        resolve(savedOrder);
      });
  });
};

const checkIfValidProducts = (productIdsAndQuantities) => {
  return Promise.all(
    Object.entries(productIdsAndQuantities).map(([productIdFromOrder]) => {
      return ProductModel.exists({ _id: parseInt(productIdFromOrder) }).then(
        (exists) => {
          if (exists === false) {
            return Promise.reject("Product does not exist in the database.");
          } else {
            return Promise.resolve("Product exists.");
          }
        }
      );
    })
  );
};
