const fs = require('fs');
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();
const bodyParser = require("body-parser");
const path = require('path');
const { graphqlHTTP } = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const {clearImage} = require('./util/file');
// const cors = require('cors');


const authMiddleware = require('./middleware/auth');

app.use(bodyParser.json());

app.use(
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null, "images");
      },
      filename: (req, file, cb) => {
          cb(null, file.originalname.replace(/\s/g, ""));
      },
    }),
    fileFilter: (req, file, cb) => {
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ? cb(null, true) : cb(null, false);
    },
  }).single("image")
);

app.use('/images', express.static(path.join(__dirname, 'images')));

// app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-allow-origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  // to make options request in graphql
  if(req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});



app.use(authMiddleware);

app.post('/post-image', (req, res, next)=>{
  if(!req.auth) {
    throw new Error("Not authenticated.");
  }

  if(!req.file) {
    return res.status(200).json({message: "no file provided!"});
  }
  if(req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  return res.status(201).json({message: "File stored", filePath: req.file.path});
});

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  //to play around with grapql api set this flag to true
  graphiql: true,
  formatError(err) {
    // originalError set by express-graphql when it detects error thrown by you
    if(!err.originalError) {
      return err;
    }
    const data = err.originalError.data;
    const message = err.originalError.message ||  "Some Error happened";
    const code = err.originalError.code || 500;
    return {message: message, code: code, data: data};
  }
}));


app.use((err, req, res, next) => {
  console.log(err); 
  res.status(err.statusCode || 500).json({ message: err.message, data: err.data });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.zgpxi.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    app.listen(process.env.PORT || 8080);
  });
