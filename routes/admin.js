const express = require("express");

const router = express.Router();

const isAuth = require("../middleware/is-auth");

const adminController = require("../controllers/admin");

const { check, body } = require("express-validator");

const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct
} = adminController;

router.get("/products", isAuth, getProducts);

router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("imageUrl").isURL(),
    body("price").isNumeric(),
    body("description").isLength({ min: 3 })
  ],
  isAuth,
  postAddProduct
);

router.get("/add-product", isAuth, getAddProduct);

router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("imageUrl").isURL(),
    body("price").isNumeric(),
    body("description").isLength({ min: 3 })
  ],
  isAuth,
  postEditProduct
);

router.post("/delete-product", isAuth, postDeleteProduct);

module.exports = router;
