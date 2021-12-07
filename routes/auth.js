const express = require("express");

const { check, body } = require("express-validator");

const router = express.Router();

const User = require("../models/user");

const authController = require("../controllers/auth");

const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword
} = authController;

// router.get("/login", getLogin);

// router.get("/signup", getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("enter a valid email")
      .normalizeEmail()
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("Email already exists");
        }
        return user;
      }),
    body(
      "password",
      "Please enter a password with a minimum of 5 chars in length"
    )
      .isLength({ min: 5 })
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          return Promise.reject("Passwords do not match");
        }
        return true;
      })
  ],
  postSignup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("enter a valid email").normalizeEmail(),
    body("password", "Password must be at least 5 chars in length")
      .isLength({
        min: 5
      })
      .trim()
  ],
  postLogin
);

router.post("/logout", postLogout);

router.get("/reset", getReset);

router.post("/reset", postReset);

router.get("/reset/:token", getNewPassword);

router.post("/new-password", postNewPassword);

module.exports = router;
