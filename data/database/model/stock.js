const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSchema = new Schema({
    _id: {
        product: {
            type: Number,
            ref: 'Product',
            required: true//,
            //autopopulate: true
        },
        location: {
            type: Number,
            ref: 'Location',
            required: true//,
            //autopopulate: true
        }
    },
    quantity: {
        type: Number,
        min: 0,
        validate: (value) => {
            return Number.isInteger(value);
        },
        required: true
    }
})

stockSchema.post('validate', function () {
    return new Promise((resolve, reject) => {
        const ProductModel = mongoose.model('Product');
        const LocationModel = mongoose.model('Location');
        ProductModel.findById(this._id.product).exec()
            .then((product) => {
                if (product === null) {
                    reject("Product id doesn't exist.");
                }
                LocationModel.findById(this._id.location).exec()
                .then((location) => {
                    if (location === null) {
                        reject("Location id doesn't exist.");
                    }
                    else
                    {
                        resolve("Valid product and location.");
                    }
                })
            });
    })
})

//stockSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model("Stock", stockSchema);