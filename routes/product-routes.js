const express = require('express');
const router = express.Router();
const productController = require('../controller/product-controller')

router.get('/', productController.getAllProducts);

router.get('/category/:categoryId', productController.getProductsFromCategory);

router.get('/:id', productController.getProduct);

router.post('/', productController.addProduct);

router.delete('/:id', productController.deleteProduct);

router.put('/', productController.updateProduct);

module.exports = router;