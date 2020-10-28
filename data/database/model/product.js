const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productSchema = new Schema({
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
    },
    price: {
        type: Number,
        required: true,
        validate: (value) => {
            return value > 0;
        }
    },
    weight: {
        type: Number,
        required: true,
        validate: (value) => {
            return value > 0;
        }
    },
    category: {
        type: Number,
        ref: 'Category',
        required: true,
        autopopulate: true
    },
    supplier: {
        type: Number,
        ref: 'Supplier',
        required: false
    },
    imageUrl: {
        type: String,
        required: false,
        maxlength: 500
    }
})

productSchema.post('validate', function () {
    return new Promise((resolve, reject) => {
        const CategoryModel = mongoose.model('Category');
        CategoryModel.findById(this.category).exec()
            .then((category) => {
                if (category === null) {
                    reject("Category id doesn't exist.")
                }
                resolve("Valid category id.")
            })
    });
})

productSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model("Product", productSchema);
