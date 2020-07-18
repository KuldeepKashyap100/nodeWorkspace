const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    title: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(
    req.body.title,
    req.body.imageURL,
    req.body.description,
    req.body.price
  );
  product.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit === "true" ? true : false;
  if(!editMode)
        return res.redirect('/');
  const productId = parseInt(req.params.productId);
  Product.findById(productId, (product)=>{
      if(!product)
        return res.redirect('/');
    res.render("admin/edit-product", {
    title: "Edit Product",
    path: "/admin/edit-product",
    editing: editMode,
    product: product
    }); 
  });
};

exports.postEditProduct = (req, res, next) => {
  const body = req.body;
  const product = new Product(parseInt(body.id), body.title, body.imageURL, body.description, body.price);
  product.save();
  res.redirect('/admin/products');
};

exports.deleteProduct = (req, res, next) => {
  const id = parseInt(req.body.productId);
  Product.deleteProduct(id, ()=>{
    res.redirect('/admin/products');
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      products: products,
      title: "Admin Products",
      path: "/admin/products",
    });
  });
};