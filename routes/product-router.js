const express = require('express');
const { isInteger } = require('lodash');
const Product = require('../model/product')
const ProductService = require('../service/product-service')

const router = express.Router();
const productService = new ProductService();

const convertRequestBodyToProduct = (requestBody) => {
    return new Promise((resolve, reject) => {
        let validatorErrors = "";
        if (!isInteger(requestBody.id) || parseInt(requestBody.id) < 0) {
            validatorErrors += "Product id is not a positive integer!\n";
        }
        if (!isInteger(requestBody.categoryId) || parseInt(requestBody.categoryId) < 0) {
            validatorErrors += "Category id is not a positive integer!\n";
        }
        if (validatorErrors === "") {
            resolve(new Product(parseInt(requestBody.id), requestBody.name, requestBody.description, requestBody.price, requestBody.weight, parseInt(requestBody.categoryId), requestBody.supplierId, requestBody.imageUrl));
        }
        else {
            reject(validatorErrors);
        }
    })
}

router.get('/category/:categoryId', (req, res) => {
    productService.getProductsInCategory(parseInt(req.params.categoryId))
        .then((result) => { res.status(200).json(result) });
});

router.get('/:id', (req, res) => {
    productService.getProductById(parseInt(req.params.id))
        .then((result) => { res.status(200).json(result) },
            (error) => { res.status(404).json(error) });
});

router.post('/', (req, res) => {
    convertRequestBodyToProduct(req.body)
        .then((result) => productService.addProduct(result), (error) => { res.status(400).send(error) })
        .then((result) => { res.status(200).json(result) })
        .catch((error) => { res.status(500).send(error) });

});

router.delete('/:id', (req, res) => {
    productService.deleteProduct(parseInt(req.params.id))
        .then((result) => { res.status(200).json(result) },
            (error) => { res.status(404).json(error) });
});

router.put('/', (req, res) => {
    convertRequestBodyToProduct(req.body)
        .then((result) => productService.updateProduct(result), (error) => { res.status(400).send(error) })
        .then((result) => { res.status(200).json(result) })
        .catch((error) => { res.status(404).send(error) });
});


module.exports = router;