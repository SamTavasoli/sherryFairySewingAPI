// Remember, you can make more of these placeholders yourself!
const express = require('express')
const router = express.Router();
const fs = require('fs');
var mongoose = require('mongoose');
var books = [];
var title = "Welcome to the wonder Jouna's Dictionary Place";


const User = mongoose.model('User', mongoose.Schema({
  email: String,
  fname: String,
  lname: String,
  pw: String,
  cart: [{
    itemID: Number,
    name: String,
    price: Number
  }]
}));


router.get('/', (req, res, next) => {
  // This is the primary index, always handled last.
  let state = "";
  
  
router.get('/signup', (req, res, next) => {
  res.render('pages/signup', {
    title: title,
    path: '/'
  });
}})

router.get('/signin', (req, res, next) => {
  res.render('pages/signin', {
    title: title,
    path: '/'
  });
})

router.post('/login-user', (req, res, next) => {
  User.find({email: req.body.email, pw: req.body.pw},function(err, docs){
    if (err){
      console.log(err)
      res.send("Server not connected");
    }
    else{
      console.log(docs)
      if (docs.length <= 0){
        res.send("Username or Password is incorrect.");
      }
      else{
        req.session.userid = docs[0].email;
        res.send("success");
      }
    }
  })
})


router.post('/create-user', (req, res, next) => {
  console.log("Create-user page");
  User.find({email: req.body.email},function(err, docs){
    if (err){
      console.log(err);
      res.send("Server not connected");
    }else{
      if (docs.length == 0){
        User.create([{
          email: req.body.email,
          fname: req.body.fname,
          lname:  req.body.lname,
          pw: req.body.pw,
          cart: []
        }])
      
        res.redirect('./');
      }
      else{
        res.send("Email has already existed");
      }
    }
  });
})

router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;
