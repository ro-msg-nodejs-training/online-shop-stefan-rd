const express = require('express');
const router = express.Router();
const productController = require('../controller/product-controller')
const upload = require('../multer-images-config')

router.get('/', productController.getAllProducts);

router.get('/category/:categoryId', productController.getProductsFromCategory);

router.get('/:id', productController.getProduct);

router.post('/', productController.addProduct);

router.delete('/:id', productController.deleteProduct);

router.put('/', productController.updateProduct);

router.post('/images/:productId', productController.checkIfProductIdIsValid, upload.upload.single('product-image'), productController.uploadProductImage);

router.delete('/images/:productId', productController.checkIfProductIdIsValid, productController.removeProductImage);

router.get('/images/:productId', productController.checkIfProductIdIsValid, productController.downloadProductImage);

router.get('/all/images', productController.getAllImageNames)

module.exports = router;