const fs = require("fs");
const path = require("path");

const { Schema, model } = require("mongoose");

const { ObjectId } = Schema.Types;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = model("Product", productSchema);
