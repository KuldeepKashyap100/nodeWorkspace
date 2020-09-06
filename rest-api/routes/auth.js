const express = require("express");

const authController = require("../controllers/auth");
const { body } = require("express-validator");
const User = require("../model/user");
const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("email address alredy exists!");
          }
          return value;
        });
      })
      .normalizeEmail(),
    body("password").trim().not().isEmpty(),
  ],
  authController.signup
);

router.post('/login', authController.postLogin);

module.exports = router;
