
class ProductRepositoryInMemory {
    static #PRODUCTS = [];

    add(product) {
        return new Promise((resolve, reject) => {
            this.findProduct(product.id)
                .then(
                    () => { reject("Product already exists!"); },
                    () => {
                        ProductRepositoryInMemory.#PRODUCTS.push(product);
                        resolve(product);
                    }
                )
        });
    }

    getAll() {
        return new Promise((resolve) => {
            resolve(ProductRepositoryInMemory.#PRODUCTS);
        });
    }

    delete(productId) {
        return new Promise((resolve, reject) => {
            this.findProduct(productId)
                .then(
                    (product) => {
                        ProductRepositoryInMemory.#PRODUCTS = ProductRepositoryInMemory.#PRODUCTS.filter(element => element.id !== product.id);
                        resolve(product);
                    },
                    () => { reject("Product doesn't exist!"); }
                )
        });

    }

    findProduct(productId) {
        return new Promise((resolve, reject) => {
            let product = ProductRepositoryInMemory.#PRODUCTS.find(element => element.id === productId);
            if (typeof product !== 'undefined') {
                resolve(product);
            }
            else {
                reject("Product not found!");
            }
        });
    }

    update(updatedProduct) {
        return new Promise((resolve, reject) => {
            this.findProduct(updatedProduct.id)
                .then(
                    (product) => {
                        product.name = updatedProduct.name;
                        product.description = updatedProduct.description;
                        product.price = updatedProduct.price;
                        product.weight = updatedProduct.weight;
                        product.categoryId = updatedProduct.categoryId;
                        product.supplierId = updatedProduct.supplierId;
                        product.imageUrl = updatedProduct.imageUrl;
                        resolve(product);
                    },
                    () => { reject("Product doesn't exist!"); }
                )
        });
    }
}

module.exports = ProductRepositoryInMemory;