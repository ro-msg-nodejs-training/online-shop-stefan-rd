const CategoryModel = require("../data/database/models/category");

exports.getCategories = async () => {
  return CategoryModel.find({});
};
