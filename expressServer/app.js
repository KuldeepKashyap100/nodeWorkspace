const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs=require('express-handlebars');


const adminRoutes = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/error');

const app = express();

app.set('view engine','ejs');
// app.engine('hbs',expressHbs({
//     extname: "hbs",
//     defaultLayout: "",
//     layoutsDir: "",
//  }));
// app.set('view engine','hbs');
// app.set('view engine','pug');
// app.set('view', 'views')

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes.router);

app.use(shopRouter);

app.use(errorController.get404);

app.listen(3000);