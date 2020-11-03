const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderDetailSchema = new Schema({
    _id: {
        order: {
            type: Number,
            ref: 'Order',
            required: true,
            autopopulate: true
        },
        product: {
            type: Number,
            ref: 'Product',
            required: true,
            autopopulate: true
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

OrderDetailSchema.post('validate', function () {
    return new Promise((resolve, reject) => {
        const ProductModel = mongoose.model('Product');
        const OrderModel = mongoose.model('Order');
        ProductModel.findById(this._id.product).exec()
            .then((product) => {
                if (product === null) {
                    reject("Product id doesn't exist.");
                }
                OrderModel.findById(this._id.order).exec()
                .then((order) => {
                    if (order === null) {
                        reject("Order id doesn't exist.");
                    }
                    else
                    {
                        resolve("Valid product and order.");
                    }
                })
            });
    })
})

OrderDetailSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model("OrderDetail", OrderDetailSchema);