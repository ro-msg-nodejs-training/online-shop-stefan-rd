const ProductRepositoryInMemory = require('../data/memory/product-repository-in-memory');
const CategoryRepositoryInMemory = require('../data/memory/category-repository-in-memory');

class ProductService {
    #productRepository;
    #categoryRepository;

    constructor() {
        this.#productRepository = new ProductRepositoryInMemory();
        this.#categoryRepository = new CategoryRepositoryInMemory();
    }

    checkIfCategoryExists(categoryId) {
        return new Promise((resolve, reject) => {
            this.#categoryRepository.getAll().then((categories) => {
                let categoryIds = categories.map(element => element.id);
                if (categoryIds.includes(categoryId)) {
                    resolve(true);
                }
                else {
                    reject(false)
                }
            })
        })
    }

    addProduct(product) {
        return new Promise((resolve, reject) => {
            this.checkIfCategoryExists(product.categoryId).then(() => {
                this.#productRepository.add(product).then((product) => {
                    resolve(product);
                },
                    (error) => {
                        reject(error);
                    })
            },
                () => reject("CategoryId doesn't exit!")
            )
        })
    }

    updateProduct(product) {
        return new Promise((resolve, reject) => {
            this.checkIfCategoryExists(product.categoryId).then(() => {
                this.#productRepository.update(product).then((product) => {
                    resolve(product);
                },
                    (error) => {
                        reject(error);
                    })
            },
                () => reject("CategoryId doesn't exit!")
            )
        })
    }

    deleteProduct(productId) {
        return this.#productRepository.delete(productId);
    }

    getProducts() {
        return this.#productRepository.getAll();
    }

    getCategories() {
        return this.#categoryRepository.getAll();
    }

    getProductsInCategory(categoryId) {
        return new Promise((resolve) => {
            this.#productRepository.getAll().then((products) => {
                resolve(products.filter(product => product.categoryId === categoryId));
            }
            )
        })
    }

    getProductById(productId) {
        return this.#productRepository.findProduct(productId);
    }

}

module.exports = ProductService