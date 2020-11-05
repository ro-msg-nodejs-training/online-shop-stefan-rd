const axios = require('axios');
const ProductLocationQuantity = require('../../util/product_location_quantity');
const routeMatrixUrl = "http://www.mapquestapi.com/directions/v2/routematrix?key=";

exports.run = (order, locationsWithStock) => {
    return new Promise((resolve, reject) => {
        const productIdsAndQuantities = order.productIdsAndQuantities;
        if (locationsWithStock.length === 0) {
            reject("There are no locations.")
        }

        let results = {};
        for (const [key, value] of Object.entries(productIdsAndQuantities)) {
            results[key] = new ProductLocationQuantity(parseInt(key), -1, value);
        }

        let locationsWithStockAndAddress = [];
        for (const locationWithStock of locationsWithStock) {
            locationsWithStockAndAddress.push({ location: locationWithStock.location, stockList: locationWithStock.stockList, address: locationWithStock.location.address });
        }
        locationsWithStockAndAddress.unshift({ location: null, stockList: null, address: order.address });
        locationsWithStockAndAddress = locationsWithStockAndAddress.map(locationWithStockAndAddress => {
            return { location: locationWithStockAndAddress.location, stockList: locationWithStockAndAddress.stockList, address: locationWithStockAndAddress.address.streetAddress + ", " + locationWithStockAndAddress.address.city + ", " + locationWithStockAndAddress.address.county };
        });
        let addresses = locationsWithStockAndAddress.map(location => location.address);
        
        axios.post(routeMatrixUrl + process.env.MAPQUEST_API_KEY, {
            locations: addresses,
            options: {
                allToAll: false
            }
        })
        .then((routeMatrixReponse) => {
            let distances = routeMatrixReponse.data.distance;
            for (let i = 0; i < locationsWithStockAndAddress.length; i++) {
                locationsWithStockAndAddress[i].distance = distances[i];
            }
            locationsWithStockAndAddress.shift();
            locationsWithStockAndAddress.sort((a, b) => a.distance - b.distance)
                for (const [key, value] of Object.entries(productIdsAndQuantities)) {
                    for (const locationWithStockAndAddress of locationsWithStockAndAddress) {
                        let stockForProduct = locationWithStockAndAddress.stockList.find(element => {
                            return element._id.product === parseInt(key)
                        });
                        if (stockForProduct !== undefined && stockForProduct.quantity >= value) {
                            results[key].locationId = stockForProduct._id.location;
                            break;
                        }
                    }
                }

                results = Object.values(results);
                if (results.some(element => element.locationId === -1)) {
                    reject("Could not find a suitable set of locations due to insufficient stock!");
                }
                resolve(results);
        })
    })
}