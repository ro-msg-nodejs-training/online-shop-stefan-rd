const CategoryModel = require("../data/database/models/category");

exports.getCategories = (_req, res) => {
  CategoryModel.find({})
    .then((result) => res.status(200).json(result))
    .catch((error) => res.status(500).send(error));
};
