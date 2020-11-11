const ProductModel = require("../data/database/models/product");
const CategoryModel = require("../data/database/models/category");
const validator = require("../utils/validation-util");
const productMapper = require("../mappers/product-mapper");
const fs = require("fs");
const path = require("path");
const util = require("util");
const HttpError = require("../utils/http-error");

const promisify = util.promisify;
const deleteFile = promisify(fs.unlink);
const readFolder = util.promisify(fs.readdir);

const pathToImageFolder = path.join(__dirname, "..", "..", "tmp", "images");

const checkIfCategoryExists = async (categoryId) => {
  const category = await CategoryModel.findById(categoryId).exec();
  if (category === null) {
    throw new HttpError(
      "The given category ID does not exist: " + categoryId,
      404
    );
  } else {
    return category;
  }
};

exports.getAllProducts = async () => {
  return ProductModel.find({}).exec();
};

exports.getProductsFromCategory = async (req) => {
  const categoryId = await validator.validateId(req.params.categoryId);
  await checkIfCategoryExists(categoryId);
  return ProductModel.find({ category: categoryId }).exec();
};

exports.getProduct = async (req) => {
  const productId = await validator.validateId(req.params.id);
  const product = await ProductModel.findById(productId).exec();
  if (product === null) {
    throw new HttpError(
      "Product could not be retrieved because the given product ID does not exist: " +
        productId,
      404
    );
  } else {
    return product;
  }
};

exports.addProduct = async (req) => {
  const productModel = await productMapper.mapRequestBodyToProductModel(
    req.body
  );
  return productModel.save().exec();
};

exports.deleteProduct = async (req) => {
  const productId = await validator.validateId(req.params.id);
  const deletedProduct = await ProductModel.findByIdAndDelete(productId).exec();
  if (deletedProduct === null) {
    throw new HttpError(
      "Product could not be deleted because the given product ID does not exist: " +
        productId,
      404
    );
  } else {
    const imagePath = path.join(pathToImageFolder, deletedProduct.imageUrl);
    if (deletedProduct.imageUrl !== "") {
      await deleteFile(imagePath);
    }
    return deletedProduct;
  }
};

exports.updateProduct = async (req) => {
  const update = await productMapper.mapRequestBodyToProductModel(req.body);
  const productToUpdate = await ProductModel.findById(update.id).exec();
  if (productToUpdate === null) {
    throw new HttpError(
      "Product could not be updated because the given product ID does not exist: " +
        update.id,
      404
    );
  } else {
    productToUpdate.name = update.name;
    productToUpdate.description = update.description;
    productToUpdate.price = update.price;
    productToUpdate.weight = update.weight;
    productToUpdate.category = update.category;

    productToUpdate.markModified("name");
    productToUpdate.markModified("description");
    productToUpdate.markModified("price");
    productToUpdate.markModified("weight");
    productToUpdate.markModified("category");

    return productToUpdate.save().exec();
  }
};

exports.uploadProductImage = async (req) => {
  const productId = await validator.validateId(req.params.productId);
  const product = await ProductModel.findById(productId).exec();
  if (product === null) {
    throw new HttpError(
      "The image cannot be uploaded because the given product ID does not exist: " +
        req.params.productId,
      404
    );
  } else {
    const imagePath = path.join(pathToImageFolder, product.imageUrl);
    if (product.imageUrl !== "") {
      await deleteFile(imagePath);
    }
    product.imageUrl = req.file.filename;
    product.markModified("imageUrl");
    return product.save().exec();
  }
};

exports.removeProductImage = async (req) => {
  const productId = await validator.validateId(req.params.productId);
  const product = await ProductModel.findById(productId).exec();
  if (product === null) {
    throw new HttpError(
      "The image cannot be removed because the given product ID does not exist: " +
        req.params.productId,
      404
    );
  } else {
    const imagePath = path.join(pathToImageFolder, product.imageUrl);
    if (product.imageUrl !== "") {
      await deleteFile(imagePath);
      product.imageUrl = "";
      product.markModified("imageUrl");
      return product.save().exec();
    }
    return product;
  }
};

exports.getImageStream = async (req) => {
  const productId = await validator.validateId(req.params.productId);
  const product = await ProductModel.findById(productId).exec();
  if (product === null) {
    throw new HttpError(
      "The image cannot be downloaded because the given product ID does not exist: " +
        req.params.productId,
      404
    );
  } else {
    const imagePath = path.join(pathToImageFolder, product.imageUrl);
    if (product.imageUrl !== "") {
      return {
        imageName: product.imageUrl,
        readStream: fs.createReadStream(imagePath),
      };
    } else {
      throw new HttpError(
        "There is no image for the product with the given ID: " + product.id,
        404
      );
    }
  }
};

exports.getAllImageNames = async () => {
  return readFolder(pathToImageFolder);
};
