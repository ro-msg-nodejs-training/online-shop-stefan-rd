const productService = require("../services/product-service");
const HttpError = require("../utils/http-error");

exports.getAllProducts = async (_req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send(error.stack);
    } else {
      res.status(500).send(error.stack);
    }
  }
};

exports.getProductsFromCategory = async (req, res) => {
  try {
    const products = await productService.getProductsFromCategory(req);
    res.status(200).json(products);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send(error.stack);
    } else {
      res.status(500).send(error.stack);
    }
  }
};

exports.getProduct = async (req, res) => {
  try {
    const products = await productService.getProduct(req);
    res.status(200).json(products);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send(error.stack);
    } else {
      res.status(500).send(error.stack);
    }
  }
};

exports.addProduct = async (req, res) => {
  try {
    const products = await productService.addProduct(req);
    res.status(200).json(products);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send(error.stack);
    } else {
      res.status(500).send(error.stack);
    }
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const products = await productService.deleteProduct(req);
    res.status(200).json(products);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send(error.stack);
    } else {
      res.status(500).send(error.stack);
    }
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const products = await productService.updateProduct(req);
    res.status(200).json(products);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send(error.stack);
    } else {
      res.status(500).send(error.stack);
    }
  }
};

exports.uploadProductImage = async (req, res) => {
  try {
    const products = await productService.uploadProductImage(req);
    res.status(200).json(products);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send(error.stack);
    } else {
      res.status(500).send(error.stack);
    }
  }
};

exports.removeProductImage = async (req, res) => {
  try {
    const products = await productService.removeProductImage(req);
    res.status(200).json(products);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send(error.stack);
    } else {
      res.status(500).send(error.stack);
    }
  }
};

exports.downloadProductImage = async (req, res) => {
  try {
    const { imageName, readStream } = await productService.getImageStream(req);
    res.setHeader("content-type", "multipart/form-data");
    res.header("Content-Disposition", "attachment; filename=" + imageName);
    readStream.pipe(res);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send(error.stack);
    } else {
      res.status(500).send(error.stack);
    }
  }
};

exports.getAllImageNames = async (_req, res) => {
  try {
    const products = await productService.getAllImageNames();
    res.status(200).json(products);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send(error.stack);
    } else {
      res.status(500).send(error.stack);
    }
  }
};
