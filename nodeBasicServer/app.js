const path=require('path');
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname,'public')));
app.use('/users',(req,res,next)=>{
    res.sendFile(path.join(path.dirname(process.mainModule.filename),'views','users.html'));
});
app.use('/',(req,res,next)=>{
    res.send('<h1>root url</h1>');
});
app.listen(3000);