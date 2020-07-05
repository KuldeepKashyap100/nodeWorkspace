const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
// const expressHbs=require('express-handlebars');

const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");
const errorController = require("./controllers/error");

const app = express();

//ejs templating engine
app.set("view engine", "ejs");

//handle bars templating engine (we are registering this templating engine beacuse it is not built in)
// app.engine('hbs',expressHbs({
//     extname: "hbs",
//     defaultLayout: "",
//     layoutsDir: "",
//  }));
// app.set('view engine','hbs');

//pug templating engine (kind of built in)
// app.set('view engine','pug');
// app.set('view', 'views')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes.router);

app.use(shopRouter);

app.use(errorController.get404);

app.listen(3000);
