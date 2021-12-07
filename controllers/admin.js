const Product = require("../models/product");

const { validationResult } = require("express-validator/check");

exports.postAddProduct = async (req, res, next) => {
  try {
    const { title, price, description, imageUrl } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/edit-product",
        editing: false,
        hasError: true,
        product: {
          title,
          price,
          description,
          imageUrl
        },
        validationErrors: errors && errors.array() ? errors.array() : []
      });
    }
    console.log("ID ///////////", req.user._id);
    const product = await new Product({
      title,
      price,
      description,
      imageUrl,
      userId: req.user
    });

    product.save();
    console.log("req.body", req.body);
    res.redirect("/");
  } catch (error) {
    const e = new Error(error);
    e.httpStatusCode = 500;
    next(e);
  }
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    product: null,
    hasError: false,
    validationErrors: []
  });
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = Boolean(req.query.edit);
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (
    !editMode ||
    !product ||
    product.userId.toString() !== req.user._id.toString()
  ) {
    return res.redirect("/");
  }
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    editing: editMode,
    product,
    hasError: false,
    validationErrors: []
  });
};

exports.postEditProduct = async (req, res, next) => {
  const { productId, title, imageUrl, description, price } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array()[0].msg);
    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title,
        price,
        description,
        imageUrl,
        _id: productId
      },
      validationErrors: errors && errors.array() ? errors.array() : []
    });
  }
  const product = await Product.findById(productId);
  product.title = title;
  product.imageUrl = imageUrl;
  product.description = description;
  product.price = price;
  product.save();
  res.redirect("/admin/products");
};

exports.getProducts = async (req, res, next) => {
  const products = (await Product.find({ userId: req.user._id })) || [];
  console.log("products", products);
  res.render("admin/products", {
    prods: products,
    pageTitle: "admin products",
    path: "/admin/products"
  });
};

exports.postDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  await Product.deleteOne({ _id: productId, userId: req.user._id });
  res.redirect("/admin/products");
};
