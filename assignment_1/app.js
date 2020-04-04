const express = require('express');
const app = express();
app.use('/users',(req,res,next)=>{
    res.send('<h1>Users Url</h1>');
});
app.use('/',(req,res,next)=>{
    res.send('<h1>root url</h1>');
});
app.listen(3000);