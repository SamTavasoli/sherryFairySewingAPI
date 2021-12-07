const User = require("../models/user");

const bcrypt = require("bcryptjs");

const crypto = require("crypto");

const { validationResult } = require("express-validator");

const { sendMessage } = require("../email");

exports.getLogin = (req, res, next) => {
  let email,
    password = "";
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    oldInput: { email, password },
    validationErrors: []
  });
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "reset password"
  });
};

exports.postReset = (req, res, next) => {
  try {
    console.log("post reset hit");
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        console.error(err);
        req.flash("error", err.message);
        return res.redirect("/reset");
      }
      const token = buffer.toString("hex");
      const { email } = req.body;
      const user = await User.findOne({ email });
      console.log("user", user);
      if (!user) {
        req.flash("error", "No account found under that email address");
        return res.redirect("/reset");
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 360000;
      await user.save();
      const html = `<p>You requested a password reset. Click <a href="http://localhost:3000/reset/${token}">here</a> to reset</p>`;
      await sendMessage(email, "Password Reset", html);
      return res.redirect("/");
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getSignup = (req, res, next) => {
  let email,
    password,
    confirmPassword = "";
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    oldInput: {
      email,
      password,
      confirmPassword
    },
    validationErrors: []
  });
};

exports.postSignup = async (req, res, next) => {
  console.log("Connected With React! post signup. body: " + JSON.stringify(req.body) );

  try {
    const errors = validationResult(req);
    const { email, password, confirmPassword } = req.body;
    const oldInput = { email, password, confirmPassword };
    if (!errors.isEmpty()) {
      console.log(errors.array()[0].msg);
      req.flash("error", errors.array()[0].msg);
      return res.status(424).json({error: errors.array()[0].msg})
    }
    let user = await User.findOne({ email });

    if (user) {
      console.log("email already exists");
      req.flash("error", "email already exists");
      return res.status(421).json({error: "email already exists"});
    }
    const hashedPassword = bcrypt.hashSync(password, 12);
    user = new User({
      email,
      password: hashedPassword,
      cart: { items: [] }
    });
    await user.save();
    await sendMessage(
      email,
      "Signup Seccess",
      "<p>You successfully signed up</p>"
    );
    console.log("Successfully signup! ");
    res.status(200).json({error:""});
  } catch (error) {
    console.error(error);
  }
};
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array()[0].msg);
    res(errors.array()[0].msg);
  }
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.status(421).json({isAuth : false, message : ' Auth failed ,email not found'});
      }
      const valid = bcrypt.compareSync(password, user.password);
      if (valid) {
        req.session.loggedIn = true;
        req.session.user = user;
        console.log("session", req.session);
        req.session.save(() => {
          res.status(200);
        });
      } else {
        req.flash("error", "invalid email or password");
        res.status(421).json({error:"invalid email or password"});
      }
    })
    .catch(err => {
      console.log(err);
      const e = new Error(err);
      next(e);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getNewPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    });
    res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "new passwored",
      userId: user._id.toString() || null,
      passwordToken: token
    });
  } catch (e) {
    const error = new Error(e);
    console.log(e);
    next(error);
  }
};

exports.postNewPassword = async (req, res, next) => {
  try {
    const { password, userId, passwordToken } = req.body;
    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
    });
    user.password = bcrypt.hashSync(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.redirect("/login");
  } catch (e) {
    console.error(e);
  }
};
