class Product {

    constructor(id, name, description, price, weight, categoryId, supplierId, imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.weight = weight;
        this.categoryId = categoryId;
        this.supplierId = supplierId;
        this.imageUrl = imageUrl;
    }
}

module.exports = Product;