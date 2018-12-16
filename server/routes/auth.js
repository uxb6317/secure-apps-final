const express = require("express");
const { body } = require("express-validator/check");

const User = require("../models/user");
const authController = require("../controllers/auth");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.get("/logout", isAuth, authController.logout);

router.post("/login", authController.login);

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid E-mail.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject(
              "Account with this E-mail address already exists."
            );
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be 6 or longer characters."),
    body("passwordConfirm")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          return Promise.reject("Passwords don't match.");
        } else {
          return value;
        }
      }),
    body("name")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Name is required.")
  ],
  authController.signup
);

module.exports = router;
