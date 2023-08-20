var express = require('express');
var router = express.Router();
var User = require("../models/user");
var passport = require('passport');

/* GET home page. */
//GET handler for// < root of the site
router.get('/', function(req, res, next) {
  res.render('index', { title: 'User Management App', user: req.user });
});

/* GET about page. */
//GET handler for//about
//router.get('/about', function(req, res, next) {
//  res.render('about', { title: 'About Us' });
//});

// Login and Register functionality
// GET handler for /login
router.get("/login", (req, res, next) => {
  // read messages from session if any
  let messages = req.session.messages || [];
  // clear messages
  req.session.messages = [];
  // pass messages to the view
  res.render("login", { title: "Login to your Account", messages: messages });
});
// POST handler for /login
router.post("/login", passport.authenticate("local", {
  successRedirect:"/customers",
  failureRedirect: "/login",
  failureMessage: "Invalid Credentials" // don't be too specific with login error messages
}));

// GET handler for /register
router.get("/register", (req, res, next) => {
  res.render("register", { title: "Create a new Account" });
});

// POST handler for /register
router.post("/register", (req, res, next)=>{
  // creates a new user in the DB
  // takes three parameters: new user object, password, callback function
  User.register(
    new User({ username: req.body.username }),
    req.body.password, // it will be encrypted
    (err, newUser) =>{
      if (err) {
        console.log(err);
        return res.redirect("/register");
      }
      else {
        req.login(newUser, (err) => {
          res.redirect("/customers"); // login successful, initialize session for user and redirect to customers
        });
      }
    }
  );
});

// GET handler for /logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    res.redirect("/login");
  });
});

// GET handler for /github
// user gets sent to GitHub.com to enter their credentials
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user.email"] })
);

// GET handler for /github/callback
// user is sent back from github.com after authenticating
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res, next) => {
    res.redirect("/customers");
  }
);

// GET handler for /google
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// GET handler for /auth/google/callback
router.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/customers"); // Redirect to customers page on successful Google login
  }
);

module.exports = router;
