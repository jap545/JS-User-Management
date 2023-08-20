var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// import config obj and mongoose package
var configs = require('./configs/globals');
var mongoose = require('mongoose'); // install via npm, this allows our app to connect to MongoDB

// import passport and session modules
var passport = require('passport');
var session = require('express-session');

// import User model
var User = require('./models/user');

var githubStrategy = require("passport-github2").Strategy;

var GoogleStrategy = require('passport-google-oauth20').Strategy;


var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var customersRouter = require('./routes/customers');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configure session module, specify: secret value for hashing, two options
// https://www.npmjs.com/package/express-session
app.use(session({
  secret: 's2023usermanagement',
  resave: false,
  saveUninitialized: false
}));
// configure passport initialization
app.use(passport.initialize());
app.use(passport.session()); 
// what strategy would you want to implement??? 
// implement local strategy (username/password)
passport.use(User.createStrategy()); // createStrategy() comes from plm module

// configure github oauth strategy
passport.use(
  new githubStrategy(
    {
      clientID: configs.github.clientId,
      clientSecret: configs.github.clientSecret,
      callbackURL: configs.github.callbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ oauthId: profile.id });
      if (user) {
        return done(null, user);
      }
      else {
        const newUser = new User({
          username: profile.username,
          oauthId: profile.id,
          oauthProvider: "GitHub",
          created: Date.now()
        });
        const savedUser = await newUser.save();
        return done(null, savedUser);
      }
    }
  )
);

// configure google oauth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: configs.google.clientId,
      clientSecret: configs.google.clientSecret,
      callbackURL: configs.google.callbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      // Your implementation for handling Google authentication
      const user = await User.findOne({ oauthId: profile.id });
      if (user) {
        return done(null, user);
      } else {
        const newUser = new User({
          username: profile.displayName,
          oauthId: profile.id,
          oauthProvider: 'Google',
          created: Date.now(),
        });
        const savedUser = await newUser.save();
        return done(null, savedUser);
      }
    }
  )
);


// tell passport how to serialize/deserialize user data
passport.serializeUser(User.serializeUser()); // method comes from plm
passport.deserializeUser(User.deserializeUser());
// TODO: implement oauth strategy

app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/about', aboutRouter);
app.use('/customers', customersRouter);

// connect to the db after registering router objects
mongoose.set('strictQuery', false);

mongoose
  .connect(configs.db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((message) => {
    console.log('Connected successfully!');
  })
  .catch((error) => {
    console.log(`Error while connecting! ${error}`);
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
