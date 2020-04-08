const fs = require('fs');
const path = require('path');
const products = [];

const productsPath = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');
const getProductsFromFile = (cb) => {
    let products = [];
    fs.readFile(productsPath, (err, fileContent) => {
        if (err) {
            cb([]);
            return;
        }
        cb(JSON.parse(fileContent));
    })
}
module.exports = class Product {
    constructor(title) {
        this.title = title;
    }
    save() {
        getProductsFromFile((products)=>{
            products.push(this);
            fs.writeFile(productsPath, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
}