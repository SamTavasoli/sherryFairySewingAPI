const { Schema, model } = require("mongoose");

const { ObjectId } = Schema.Types;

const orderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  user: {
    email: {
      type: String,
      required: true
    },
    userId: {
      type: ObjectId,
      required: true,
      ref: "User"
    }
  }
});

module.exports = model("Order", orderSchema);
