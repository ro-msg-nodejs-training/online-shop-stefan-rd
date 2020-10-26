var express = require('express');
var router = express.Router();

const ProductService = require('../service/product-service')
const productService = new ProductService();

router.get('/', (req, res) => {
    productService.getCategories()
        .then((result) => { res.status(200).json(result) });
})

module.exports = router;