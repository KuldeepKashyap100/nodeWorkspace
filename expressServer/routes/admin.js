const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

router.get('/add-product', (req, res, next) => {
    // res.sendFile(path.join(__dirname,'..','views','add-product.html'));
    res.sendFile(path.join(rootDir,'views','add-product.html'));
});

router.use('/product',(req,res,next)=>{
    res.redirect('/');
});

module.exports = router;