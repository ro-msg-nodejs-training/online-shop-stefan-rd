const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let locationSchema = new Schema({
  _id: {
    type: Number,
    min: 0,
    validate: (value) => {
      return Number.isInteger(value);
    },
  },
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  address: {
    country: {
      type: String,
      required: true,
      maxlength: 100,
    },
    county: {
      type: String,
      required: true,
      maxlength: 100,
    },
    city: {
      type: String,
      required: true,
      maxlength: 100,
    },
    streetAddress: {
      type: String,
      required: true,
      maxlength: 100,
    },
  },
});

module.exports = mongoose.model("Location", locationSchema);
