const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let orderSchema = new Schema({
    _id: {
        type: Number,
        min: 0,
        validate: (value) => {
            return Number.isInteger(value);
        }
    },
    shippedFrom: {
        type: Number,
        ref: 'Location',
        required: true,
        autopopulate: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    address: {
        country: {
            type: String,
            required: true,
            maxlength: 100
        },
        county: {
            type: String,
            required: true,
            maxlength: 100
        },
        city: {
            type: String,
            required: true,
            maxlength: 100
        },
        streetAddress: {
            type: String,
            required: true,
            maxlength: 100
        }
    }
})

orderSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model("Order", orderSchema);