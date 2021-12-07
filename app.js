require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const uri = `mongodb+srv://1234:1234@cluster0.mkgtg.mongodb.net/test`;

const User = require("./models/user");

const csurf = require("csurf");

const flash = require("connect-flash");

const app = express();

const session = require("express-session");

const MongoDBStore = require("connect-mongodb-session")(session);

const store = MongoDBStore({
  uri,
  collection: "users"
});

const csrfProtection = csurf();

app.use(flash());

app.set("view engine", "ejs");
app.set("views", "views");

const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

const bodyParser = require("body-parser");

const { get404Page, get500Page } = require("./controllers/error");

const adminRoutes = require("./routes/admin");

const shopRoutes = require("./routes/shop");

const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
});

app.use((bodyParser.json({
  type: "*/*"
})));

app.use(
  session({
    secret: "MySeniorProject",
    resave: false,
    saveUninitialized: false,
    store
  })
);

// app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.loggedIn;
  //res.locals.csrfToken = req.csrfToken();
  res.header("Access-Control-Allow-Origin", "*");
  res.locals.errorMessage = req.flash("error") || null;
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      throw new Error(err);
    });
});

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(authRoutes);

app.get("/500", get500Page);

app.use(get404Page);

app.use((error, req, res, next) => {
  res.redirect("/500");
});

mongoose
  .connect(uri)
  .then(result => {
    console.log("success");
    app.listen(8080);
    console.log("server is running on port 8080");
  })
  .catch(err => {
    console.log(err);
  });
