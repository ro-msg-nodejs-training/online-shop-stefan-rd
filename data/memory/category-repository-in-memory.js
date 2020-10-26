const Category = require("../../model/category");

class CategoryRepositoryInMemory {
    static #CATEGORIES = [];

    constructor() {
        for (let i = 1; i <= 4; i++) {
            let category = new Category(i, "Category " + i);
            CategoryRepositoryInMemory.#CATEGORIES.push(category);
        }
    }

    getAll() {
        return new Promise((resolve) => {
            resolve(CategoryRepositoryInMemory.#CATEGORIES)
        });
    }


}

module.exports = CategoryRepositoryInMemory;