// Our initial setup (package requires, port number setup)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors') // Place this with other requires (like 'path' and 'express')
const main = require('./routes/main.js');
var mongoose = require('mongoose');
var sessions = require('express-session');
const cookieParser = require("cookie-parser");


const corsOptions = {
  origin: "https://immense-garden-32258.herokuapp.com/",
  optionsSuccessStatus: 200
};

const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000
const app = express();
app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

  .use(cookieParser())

  .use(sessions({
    secret: "iloveCSE341",
    saveUninitialized:true,
    cookie: {},
    resave: false 
  }))
  
  .use(bodyParser({ extended: false })) // For parsing the body of a POST
  .use(cors(corsOptions))

  .use('/', main)
  

  .use((req, res, next) => {
    // 404 page
    res.render('pages/404', { title: '404 - Page Not Found', path: req.url });
  })
  .use((req, res, next) => {
    // 500 page
    res.render('pages/500', { title: '500 - Internal Server Error' });
  })
  .use((req, res, next) => {
    // 502 page
    res.render('pages/500', { title: '502 - Bad Gateway' });
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://1234:1234@cluster0.mkgtg.mongodb.net/test";
mongoose.connect(MONGODB_URL);

var db = mongoose.connection;
 
db.on('error', console.error.bind(console, 'connection error:'));
 
db.once('open', function() {
  console.log("Connection Successful!");
});



