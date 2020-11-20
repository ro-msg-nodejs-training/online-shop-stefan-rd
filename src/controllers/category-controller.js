const categoryService = require("../services/category-service");
const HttpError = require("../utils/http-error");

exports.getCategories = async (_req, res) => {
  try {
    const categories = await categoryService.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send(error.message);
    } else {
      res.status(500).send(error.stack);
    }
  }
};
