// Remember, you can make more of these placeholders yourself!
const express = require('express')
const router = express.Router();
const fs = require('fs');
var mongoose = require('mongoose');
var books = [];
var title = "Welcome to the wonder Jouna's Dictionary Place";


router.post('/addCart', (req, res, next) => {
    var newItem = {
      itemID: parseInt(req.body.id),
      name: req.body.name,
      price: parseFloat(req.body.price)
    };
    console.log(req.session);
    console.log(req.session.userid);
    
    if (req.session.userid){
        User.updateOne({email: req.session.userid},
              {$push: { 'cart' : newItem }},{upsert:true}, 
              function(err, data) {
                if (err == ""){
                  res.send("Success")
                }
                else{
                  res.send(err)
                }
  
      });
    }
    else{
      res.send("Please Login to purchase product <a href='./' class='addCart'> back </a>")
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
    User.updateOne(
      {email: req.session.userid},
      {$pull: {cart: {itemID : parseInt(req.body.itemID)}}},
      {},
      function (err, obj) {
        if (err) {
          res.send(err);
        }
        else{
        res.send("Success");
        }
      })
    })

    
module.exports = router;