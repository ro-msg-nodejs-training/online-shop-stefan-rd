const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categorySchema = new Schema({
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
        maxlength: 100
    },
    description: {
        type: String,
        required: false,
        maxlength: 500
    }
})

module.exports = mongoose.model("Category", categorySchema);