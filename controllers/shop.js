const Product = require("../models/product");
const Order = require("../models/orders");

exports.getProducts = async (req, res, next) => {
  const products = await Product.find();
  // if I wanted all the user data based off user id I could use Product.find().populate("userId")
  res.render("shop/product-list", {
    prods: products,
    pageTitle: "All Products",
    path: "/products"
  });
};

exports.getProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  res.render("shop/product-detail", {
    product,
    pageTitle: product.title,
    path: "/products"
  });
};

exports.getIndex = async (req, res, next) => {
  const products = await Product.find();
  res.render("shop/index", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    csrfToken: req.csrfToken()
  });
};

exports.getCart = async (req, res, next) => {
  const user = await req.user.populate("cart.items.productId");
  const products = user.cart.items;

  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Cart",
    products: products
  });
};

exports.postCart = async (req, res, next) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  await req.user.addToCart(product);
  res.redirect("/cart");
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  await req.user.deleteItemFromCart(productId);
  res.redirect("/cart");
};

exports.getOrders = async (req, res, next) => {
  const orders = await Order.find({ userId: req.user._id });
  console.log("this is orders", orders);
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Orders",
    orders
  });
};

exports.postOrder = async (req, res, next) => {
  const user = await req.user.populate("cart.items.productId");
  const products = user.cart.items.map(i => {
    return { quantity: i.quantity, product: { ...i.productId._doc } };
  });
  const order = new Order({
    user: {
      email: req.user.email,
      userId: req.user
    },
    products
  });
  order.save();
  req.user.clearCart();
  res.redirect("/orders");
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout"
  });
};
