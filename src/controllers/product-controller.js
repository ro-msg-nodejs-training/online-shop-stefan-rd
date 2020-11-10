const ProductModel = require("../data/database/models/product");
const CategoryModel = require("../data/database/models/category");
const Validator = require("../utils/validation-util");
const fs = require("fs");
const path = require("path");
const util = require("util");

const promisify = util.promisify;
const deleteFile = promisify(fs.unlink);
const checkIfFileExists = promisify(fs.access);
const readFolder = util.promisify(fs.readdir);

const pathToImageFolder = path.join(__dirname, "..", "tmp", "images");

const checkIfCategoryExists = (categoryId) => {
  return new Promise((resolve, reject) => {
    CategoryModel.findById(categoryId)
      .exec()
      .then((result) => {
        if (result === null) {
          reject("Category not found.");
        } else {
          resolve(result);
        }
      });
  });
};

const convertRequestBodyToProductModel = (requestBody) => {
  return new Promise((resolve, reject) => {
    Validator.validateId(requestBody.id)
      .then(() => Validator.validateId(requestBody.categoryId))
      .then(() =>
        Validator.validatePositiveDecimal(parseFloat(requestBody.price))
      )
      .then(() =>
        Validator.validatePositiveDecimal(parseFloat(requestBody.weight))
      )
      .then(() =>
        resolve(
          new ProductModel({
            _id: parseInt(requestBody.id),
            name: requestBody.name,
            description: requestBody.description,
            price: parseFloat(requestBody.price),
            weight: parseFloat(requestBody.weight),
            category: requestBody.categoryId,
            supplier: requestBody.supplierId,
            imageUrl: requestBody.imageUrl,
          })
        )
      )
      .catch((error) => reject("Could not convert." + error));
  });
};

exports.getAllProducts = (_req, res) => {
  ProductModel.find({})
    .exec()
    .then((result) => res.status(200).json(result))
    .catch((error) => res.status(500).send(error));
};

exports.getProductsFromCategory = (req, res) => {
  Validator.validateId(req.params.categoryId)
    .then(() => checkIfCategoryExists(parseInt(req.params.categoryId)))
    .then(() =>
      ProductModel.find({ category: parseInt(req.params.categoryId) }).exec()
    )
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => res.status(500).send(error.toString()));
};

exports.getProduct = (req, res) => {
  Validator.validateId(req.params.id)
    .then(() => ProductModel.findById(parseInt(req.params.id)).exec())
    .then((result) => {
      if (result === null) {
        res.status(404).send("Product not found.");
      } else {
        res.status(200).json(result);
      }
    })
    .catch((error) => res.status(400).send(error.toString()));
};

exports.addProduct = (req, res) => {
  convertRequestBodyToProductModel(req.body)
    .then((productModel) => productModel.save())
    .then((savedProduct) => res.status(200).json(savedProduct))
    .catch((error) => res.send(error));
};

exports.deleteProduct = (req, res) => {
  Validator.validateId(req.params.id)
    .then(() => ProductModel.findByIdAndDelete(parseInt(req.params.id)).exec())
    .then((deletedProduct) => {
      if (deletedProduct === null) {
        res.status(404).send("Product not found.");
      } else {
        const imagePath = path.join(pathToImageFolder, deletedProduct.imageUrl);
        res.status(200).json(deletedProduct);
        if (deletedProduct.imageUrl !== "") {
          checkIfFileExists(imagePath).then(
            () => deleteFile(imagePath),
            (error) => console.log(error.toString())
          );
        }
      }
    })
    .catch((error) => res.status(400).send(error.toString()));
};

exports.updateProduct = (req, res) => {
  convertRequestBodyToProductModel(req.body)
    .then((update) => {
      ProductModel.findById(update.id)
        .exec()
        .then((existingProduct) => {
          if (existingProduct === null) {
            res.status(404).send("Product not found.");
          } else {
            existingProduct.name = update.name;
            existingProduct.description = update.description;
            existingProduct.price = update.price;
            existingProduct.weight = update.weight;
            existingProduct.category = update.category;

            existingProduct.markModified("name");
            existingProduct.markModified("description");
            existingProduct.markModified("price");
            existingProduct.markModified("weight");
            existingProduct.markModified("category");

            existingProduct.save().then(
              (savedChange) => res.status(200).json(savedChange),
              (error) => res.status(500).send(error.toString())
            );
          }
        });
    })
    .catch((error) => res.status(400).send(error.toString()));
};

exports.uploadProductImage = (req, res) => {
  ProductModel.findById(parseInt(req.params.productId))
    .exec()
    .then((product) => {
      const imagePath = path.join(pathToImageFolder, product.imageUrl);
      if (product.imageUrl !== "") {
        checkIfFileExists(imagePath).then(
          () => deleteFile(imagePath),
          (error) => console.log(error.toString())
        );
      }
      product.imageUrl = req.file.filename;
      product.markModified("imageUrl");
      product.save().then((savedProduct) => res.status(200).json(savedProduct));
    })
    .catch((error) => res.status(500).send(error.toString()));
};

exports.removeProductImage = (req, res) => {
  ProductModel.findById(parseInt(req.params.productId))
    .exec()
    .then((product) => {
      const imagePath = path.join(pathToImageFolder, product.imageUrl);
      product.imageUrl = "";
      product.markModified("imageUrl");
      checkIfFileExists(imagePath).then(
        () => deleteFile(imagePath),
        (error) => console.log(error.toString())
      );
      product.save().then((savedProduct) => res.status(200).json(savedProduct));
    })
    .catch((error) => res.status(500).send(error.toString()));
};

exports.checkIfProductIdIsValid = (req, res, next) => {
  Validator.validateId(req.params.productId)
    .then(() => ProductModel.findById(parseInt(req.params.productId)).exec())
    .then((product) => {
      if (product === null) {
        res.status(404).send("Product not found.");
      } else {
        next();
      }
    })
    .catch((error) => res.status(400).send(error.toString()));
};

exports.downloadProductImage = (req, res) => {
  ProductModel.findById(parseInt(req.params.productId))
    .exec()
    .then((product) => {
      res.setHeader("content-type", "multipart/form-data");
      res.header(
        "Content-Disposition",
        "attachment; filename=" + product.imageUrl
      );
      const imagePath = path.join(pathToImageFolder, product.imageUrl);
      if (product.imageUrl !== "") {
        checkIfFileExists(imagePath).then(
          () => fs.createReadStream(imagePath).pipe(res),
          (error) => res.status(500).send(error.toString())
        );
      } else {
        res.status(404).send("Product has no available image.");
      }
    })
    .catch((error) => res.status(500).send(error.toString()));
  res.setHeader("content-type", "multipart/form-data");
};

exports.getAllImageNames = (_req, res) => {
  readFolder(pathToImageFolder).then(
    (folderContent) => res.status(200).json(folderContent),
    (error) => res.status(500).send(error.toString())
  );
};