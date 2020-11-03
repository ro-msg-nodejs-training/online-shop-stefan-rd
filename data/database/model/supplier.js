const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let supplierSchema = new Schema({
    _id: {
        type: Number,
        min: 0,
        validate: (value) => {
            return Number.isInteger(value);
        }
    },
    name: {
        type: String,
        required: true,
        maxlength: 100,
    }
})


module.exports = mongoose.model("Supplier", supplierSchema);