const StockModel = require("../data/database/model/stock");


const validateId = (id) => {
    return new Promise((resolve, reject) => {
        if (Number.isInteger(id) === true && parseInt(id) >= 0) {
            resolve(true);
        }
        else {
            reject("Invalid id format: " + id);
        }
    })
}

const convertRequestBodyToStockModel = (requestBody) => {
    return new Promise((resolve, reject) => {
        validateId(requestBody.productId)
            .then(() => validateId(requestBody.locationId))
            .then(() => {
                if (Number.isInteger(requestBody.quantity) === true && parseInt(requestBody.quantity) >= 0) {
                    resolve(new StockModel({
                        _id: {
                            location: requestBody.locationId,
                            product: requestBody.productId
                        },
                        quantity: requestBody.quantity
                    }))
                }
                reject("Quantity must be a positive integer.")
                
            })
            .catch((error) => reject(error));
    });
}

exports.addStock = (req, res) => {
    convertRequestBodyToStockModel(req.body)
        .then((stockModel) => stockModel.save())
        .then((savedStock) => res.status(200).json(savedStock))
        .catch((error) => res.status(500).send(error.toString()));
}

exports.deleteAllStock = (req, res) => {
    StockModel.deleteMany({})
    .then(() => res.status(200).send("All stock removed."));
}

exports.getAllStock = (req, res) => {
    StockModel.find({})
    .then((stockList) => res.status(200).json(stockList));
}
