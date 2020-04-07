const products=[];

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(__dirname,'..','views','add-product.html'));
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
    res.render('add-product',{title:"Add Product", path: '/admin/add-product'});
}

exports.postAddProduct = (req,res,next)=>{
    products.push({'title':req.body.title});
    console.log(products);
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    const products = adminData.products;
    // res.sendFile(path.join(__dirname,'..','views','shop.html'));
    // res.sendFile(path.join(rootDir,'views','shop.html'));
    res.render('shop',{products: products, title: 'shop', path: '/', hasProducts: products.length>0});
}

exports.pageNotFound = (req,res)=>{
    // res.status(404).sendFile(path.join(__dirname,'views', '404.html'));
    res.status(404).render("404",{title:'page not found',path:""});
}