const { Schema, model } = require("mongoose");

const { ObjectId } = Schema.Types;

const userSchema = new Schema({
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: ObjectId,
          ref: "Product",
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date }
});

userSchema.methods.addToCart = async function (product) {
  try {
    console.log("hit");
    const index = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    console.log("index", index);
    const updatedCartItems = [...this.cart.items];
    let newQty = 1;
    if (index >= 0) {
      newQty = this.cart.items[index].quantity + 1;
      updatedCartItems[index].quantity = newQty;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQty
      });
    }
    console.log("cart", this.cart);
    const updatedCart = {
      items: updatedCartItems
    };
    this.cart = updatedCart;
    console.log("updatedCart", updatedCart);
    return this.save();
  } catch (err) {
    console.error(err);
  }
};

userSchema.methods.deleteItemFromCart = async function (productId) {
  try {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
  } catch (e) {
    console.error(e);
  }
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = model("User", userSchema);
