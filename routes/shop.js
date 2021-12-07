const express = require("express");

const router = express.Router();

const shopController = require("../controllers/shop");

const isAuth = require("../middleware/is-auth");

const {
  getIndex,
  getProducts,
  getCart,
  getCheckout,
  getOrders,
  getProduct,
  postCart,
  postCartDeleteProduct,
  postOrder
} = shopController;

// router.get("/", getIndex);

// router.get("/products", getProducts);

// router.get("/products/:productId", getProduct);

// router.get("/cart", isAuth, getCart);

// router.post("/cart", isAuth, postCart);

router.post("/cart-delete-item", isAuth, postCartDeleteProduct);

router.get("/checkout", isAuth, getCheckout);

router.get("/orders", isAuth, getOrders);

router.post("/create-order", isAuth, postOrder);

module.exports = router;
