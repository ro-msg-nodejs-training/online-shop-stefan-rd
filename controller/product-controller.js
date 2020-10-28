const ProductModel = require('../data/database/model/product');
const CategoryModel = require('../data/database/model/category');

const validateId = (id) => {
    return new Promise((resolve, reject) => {
        if (Number.isInteger(parseInt(id)) === true && parseInt(id) >= 0) {
            resolve(true);
        }
        else {
            reject("Invalid id format: " + id);
        }
    })
}

const validatePositiveDecimal = (number) => {
    return new Promise((resolve, reject) => {
        if (isNaN(number) || parseFloat(number) <= 0) {
            reject("Invalid decimal number format: " + number);
        }
        else {
            resolve(true);
        }
    })
}

const checkIfCategoryExists = (categoryId) => {
    return new Promise((resolve, reject) => {
        CategoryModel.findById(parseInt(categoryId)).exec()
        .then((result) => {
            if(result === null)
            {
                reject("Category not found.")
            }
            else{
                resolve(result)
            }
        })
    })
}

const convertRequestBodyToProductModel = (requestBody) => {
    return new Promise((resolve, reject) => {
        validateId(parseInt(requestBody.id))
            .then(() => validateId(parseInt(requestBody.categoryId)))
            .then(() => validatePositiveDecimal(parseFloat(requestBody.price)))
            .then(() => validatePositiveDecimal(parseFloat(requestBody.weight)))
            .then(() => resolve(
                new ProductModel({
                    _id: parseInt(requestBody.id),
                    name: requestBody.name,
                    description: requestBody.description,
                    price: parseFloat(requestBody.price),
                    weight: parseFloat(requestBody.weight), 
                    category: parseInt(requestBody.categoryId),
                    //supplier: requestBody.supplierId, 
                    imageUrl: requestBody.imageUrl
                })))
            .catch((error) => reject("Could not convert." + error));
    })
}

exports.getAllProducts = (req, res) => {
    ProductModel.find({})
        .exec()
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(500).send(error));
}

exports.getProductsFromCategory = (req, res) => {
    validateId(req.params.categoryId)
    .then(() => checkIfCategoryExists(parseInt(req.params.categoryId)))
    .then(() => ProductModel.find({ category: parseInt(req.params.categoryId) }).exec())
    .then((result) => {
        res.status(200).json(result);
    })
    .catch((error) => res.status(500).send(error));
}

exports.getProduct = (req, res) => {
    validateId(req.params.id)
        .then(() => ProductModel.findById(parseInt(req.params.id)).exec())
        .then((result) => {
            if (result === null) {
                res.status(404).send("Product not found.");
            }
            else {
                res.status(200).json(result);
            }
        })
        .catch((error) => res.status(400).send(error));
}

exports.addProduct = (req, res) => {
    convertRequestBodyToProductModel(req.body)
        .then((productModel) => productModel.save())
        .then((savedProduct) => res.status(200).json(savedProduct))
        .catch((error) => res.send(error));
}

exports.deleteProduct = (req, res) => {
    validateId(req.params.id)
        .then(() => ProductModel.findByIdAndDelete(parseInt(req.params.id)).exec())
        .then((deletedProduct) => {
            if (deletedProduct === null) {
                res.status(404).send("Product not found.");
            }
            else {
                res.status(200).json(deletedProduct);
            }
        })
        .catch((error) => res.status(400).send(error.toString()))
}

exports.updateProduct = (req, res) => {
    convertRequestBodyToProductModel(req.body)
        .then((update) => {
            ProductModel.findById(update.id).exec()
            .then((existingProduct) => {
                if(existingProduct === null){
                    res.status(404).send("Product not found.");
                }
                else{
                    existingProduct.name = update.name;
                    existingProduct.description = update.description;
                    existingProduct.price = update.price;
                    existingProduct.weight = update.weight;
                    existingProduct.category = update.category;
                    existingProduct.imageUrl = update.imageUrl;

                    existingProduct.markModified('name');
                    existingProduct.markModified('description');
                    existingProduct.markModified('price');
                    existingProduct.markModified('weight');
                    existingProduct.markModified('category');
                    existingProduct.markModified('imageUrl');

                    existingProduct.save()
                    .then((savedChange) => res.status(200).json(savedChange), (error) => res.status(500).send(error.toString()))
                }
            })
        })
        .catch((error) => res.status(400).send(error));
}
