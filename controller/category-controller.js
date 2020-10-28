const CategoryModel = require('../data/database/model/category');

exports.getCategories = (req, res) => {
    CategoryModel.find({})
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(500).send(error));
}