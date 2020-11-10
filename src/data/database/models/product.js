const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let productSchema = new Schema({
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
  description: {
    type: String,
    required: false,
    maxlength: 500,
    default: "",
  },
  price: {
    type: Number,
    required: true,
    validate: (value) => {
      return value > 0;
    },
  },
  weight: {
    type: Number,
    required: true,
    validate: (value) => {
      return value > 0;
    },
  },
  category: {
    type: Number,
    ref: "Category",
    required: true,
    autopopulate: true,
  },
  supplier: {
    type: Number,
    ref: "Supplier",
    required: true,
    autopopulate: true,
  },
  imageUrl: {
    type: String,
    required: false,
    maxlength: 500,
    default: "",
  },
});

productSchema.post("validate", function () {
  return new Promise((resolve, reject) => {
    const CategoryModel = mongoose.model("Category");
    const SupplierModel = mongoose.model("Supplier");
    CategoryModel.findById(this.category)
      .exec()
      .then((category) => {
        if (category === null) {
          reject("Category id doesn't exist.");
        }
        SupplierModel.findById(this.supplier)
          .exec()
          .then((supplier) => {
            if (supplier === null) {
              reject("Supplier id doesn't exist.");
            } else {
              resolve("Valid category and supplier.");
            }
          });
      });
  });
});

productSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Product", productSchema);
