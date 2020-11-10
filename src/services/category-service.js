const CategoryModel = require("../data/database/models/category");
exports.getCategories = async () => {
  const categories = await CategoryModel.find({});
  return categories;
};
