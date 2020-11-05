const ProductLocationQuantity = require("../../util/product_location_quantity")


// eslint-disable-next-line no-unused-vars
exports.run = (order, locationsWithStock) => {
    return new Promise((resolve, reject) => {
        const productIdsAndQuantities = order.productIdsAndQuantities;
        if (locationsWithStock.length === 0) {
            reject("There are no locations.")
        }

        const results = {};
        for (const [key] of Object.entries(productIdsAndQuantities)) {
            results[key] = new ProductLocationQuantity(parseInt(key), -1, 0);
        }

        for (const locationWithStock of locationsWithStock) {
            for (const stock of locationWithStock.stockList) {
                if (Object.prototype.hasOwnProperty.call(results, stock._id.product) && stock.quantity > results[stock._id.product].quantity) {
                    results[stock._id.product].locationId = locationWithStock.location._id;
                    results[stock._id.product].quantity = stock.quantity;
                }
            }
        }

        for (const [key, value] of Object.entries(productIdsAndQuantities)) {
            if (results[key].quantity < value) {
                reject("Could not find a suitable set of locations due to insufficient stock!");
            }
            else {
                results[key].quantity = value;
            }
        }
        resolve(Object.values(results));
    })
}

