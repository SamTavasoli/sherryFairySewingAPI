// Remember, you can make more of these placeholders yourself!
const express = require('express')
const router = express.Router();
const fs = require('fs');
var mongoose = require('mongoose');
const { sendMessage } = require("./email");
var title = "Welcome to the wonder Jouna's Dictionary Place";


const User = mongoose.model('User', mongoose.Schema({
  email: String,
  fname: String,
  lname: String,
  pw: String,
  cart:{
    items: [
      {
    itemID: Number,
    name: String,
    price: Number
  }
]
}
}));


let rawdata = fs.readFileSync('./public/json/products.json');
let products = JSON.parse(rawdata);

rawdata = fs.readFileSync('./public/json/transfer.json');
let transfer = JSON.parse(rawdata);

router.get('/', (req, res, next) => {
  // This is the primary index, always handled last.
  let state = "";
  
  res.render('pages/index', {
    title: title,
    path: '/',
    products: products.list,
    state: state
  });
})


router.get('/signup', (req, res, next) => {
  res.render('pages/signup', {
    title: title,
    path: '/'
  });
})

router.get('/signin', (req, res, next) => {
  res.render('pages/signin', {
    title: title,
    path: '/'
  });
})

router.post('/login-user', (req, res, next) => {
  User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash("error", "invalid email or password");
        return res.redirect("/signin");
      }
      password = user.password;
      if (valid) {
        req.session.loggedIn = true;
        req.session.user = user;
        console.log("session", req.session);
        req.session.save(() => {
          res.redirect("/");
        });
      } else {
        req.flash("error", "invalid email or password");
        res.redirect("/signin");
      }
    })
})


router.post('/create-user', (req, res, next) => {
  console.log("Create-user page");
  let email = req.body.email;
  let password = req.body.password;

  let user = User.findOne({ email });

  if (user) {
    req.flash("error", "email already exists");
    return res.redirect("/signup");
  }
  user = new User({
    email,
    password: req.body.pw,
    cart: { items: [] }
  });
  user.save();
  sendMessage(
    email,
    "Signup Seccess",
    "<p>You successfully signedup</p>"
  );
  res.redirect("/signin");
})

router.post('/addCart', (req, res, next) => {
  var newItem = {
    itemID: parseInt(req.body.id),
    name: req.body.name,
    price: parseFloat(req.body.price)
  };
  console.log(req.session);
  console.log(req.session.userid);
  
  if (req.session.userid){
    const updatedCartItems = [...this.cart.items];
    const index = req.user.cart.items.findIndex(cp => {
      return cp.itemID === parseInt(req.body.id);
    });
    if (index >= 0) {
      newQty = req.user.cart.items[index].quantity + 1;
      updatedCartItems[index].quantity = newQty;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQty
      });
    }

    const updatedCart = {
      items: updatedCartItems
    };
    req.user.cart = updatedCart;
    console.log("updatedCart", updatedCart);
    return req.user.save();

  }
  else{
    res.flash("Please Login to purchase product <a href='./' class='addCart'> back </a>")
  }
})

router.get('/single-product/:id', (req, res, next) => {
  // This is the primary index, always handled last.
  let id = req.params.id;
  let single_product =  products.list.filter(
    function(data){ return data.id == id }
  );

  let single_product_transfer =  transfer.list.filter(
    function(data){ return data.productId == id }
  );

  console.log(single_product_transfer);

  res.render('pages/single-product', {
    title: title,
    path: '/',
    product: single_product[0],
    transfer: single_product_transfer
  });
})

router.get('/cart', (req, res, next) => {
  var cart_list = [];
  if (req.session.userid){
    User.find({email: req.session.userid},function(err, docs){
      if (err){
        console.log(err)
      }
      else{
        res.render('pages/cart', {
          title: title,
          path: '/',
          cart: docs[0].cart,
        });
      }
    })
  }
  else{
    res.send("Please sign in first.");
    res.redirect("./");
  }
})

router.post('/deleteItem', (req, res, next) => {
  const updatedCartItems = [...req.user.cart.items];
  const itemIndex = req.user.cart.items.findIndex(item => {
    return item.itemID === req.body.itemID;
  });
  let quantity = this.cart.items[index].quantity - 1;
  if (quantity <= 0){
    quantity = 0;
  }
  updatedCartItems[itemIndex].quantity = quantity; 

  req.user.cart.items = updatedCartItems;
  
  req.user.save();

})

router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
