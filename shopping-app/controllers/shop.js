const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      products: products,
      title: "All Products",
      path: "/products",
    });
  });
  // res.sendFile(path.join(__dirname,'..','views','shop.html'));
  // res.sendFile(path.join(rootDir,'views','shop.html'));
};

exports.getProduct = (req, res, next) => {
  const productId = parseInt(req.params.productId);
  Product.findById(productId, (product) => {
    res.render("shop/product-details", {
      product: product,
      title: product.title,
      path: "/products/" + productId,
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", { products: products, title: "shop", path: "/" });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (let product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
            cartProducts.push({
            productData: product,
            qty: cartProductData.qty,
          });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        title: "Your Cart",
        products: cartProducts
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const id = parseInt(req.body.productId);
  Product.findById(id, (product) => {
    Cart.addProduct(id, product.price);
    res.redirect("/");
  });
};

exports.deleteCartItem = (req, res, next) => {
    const id = parseInt(req.body.productId);
    Product.findById(id, product=>{
        Cart.deleteProduct(id, product.price);
        res.redirect('/cart');
    });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    title: "Orders",
  });
};

exports.getCheckOut = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    title: "Checkout",
  });
};
