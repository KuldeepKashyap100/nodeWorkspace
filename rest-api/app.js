const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const bodyParser = require("body-parser");
const path = require('path');

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

app.use((req, res, next) => {
  res.setHeader("Access-Control-allow-origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: err.message, data: err.data });
});

mongoose
  .connect(
    "mongodb+srv://root:38AzamslJAZXJ5Tx@cluster0.zgpxi.mongodb.net/blog?retryWrites=true",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    const server = app.listen(8080);
    const io = require('./socket').init(server);
    io.on("connection", clientConnection => {
      console.log("socket connected");
    });
  });
