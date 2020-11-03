const CategoryModel = require('./model/category');
const SupplierModel = require('./model/supplier');
const ProductModel = require('./model/product');
const LocationModel = require('./model/location');

exports.populateDatabase = () => {
    new LocationModel({
        _id: 1,
        name: "location1",
        address: {
            country: "Romania",
            county: "Cluj",
            city: "Cluj-Napoca",
            streetAddress: "Strada"
        }
    }).save();
    new LocationModel({
        _id: 2,
        name: "location2",
        address: {
            country: "Romania",
            county: "Sibiu",
            city: "Sibiu",
            streetAddress: "Strada"
        }
    }).save();
    new LocationModel({
        _id: 3,
        name: "location1",
        address: {
            country: "Romania",
            county: "Hunedoara",
            city: "Hunedoara",
            streetAddress: "Strada"
        }
    }).save();
    for(let i=1;i<=5;i++)
    {
        new CategoryModel({
            _id: i,
            name: "category" + i
        }).save()
        .then(() => {
            new SupplierModel({
            _id: i,
            name: "supplier" + i
            }).save();
        })
        .then(() => {
            new ProductModel({
                _id: i,
                name: "product" + i,
                price: 10,
                weight: 0.2,
                category: i,
                supplier: i
            }).save();
        })
    }
}