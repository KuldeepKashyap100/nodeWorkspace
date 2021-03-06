const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(__dirname,'..','views','add-product.html'));
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
    res.render('admin/add-product',{title:"Add Product", path: '/admin/add-product'});
}

exports.postAddProduct = (req,res,next)=>{
    const product= new Product(req.body.title,req.body.imageURL,req.body.description,req.body.price);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', { products: products, title: 'Admin Products', path: '/admin/products' });
    });
}