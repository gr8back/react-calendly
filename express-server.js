require('dotenv').config(); //main calendly env variables
require('dotenv').config({ path: `env.local` }); //your client id and secret
const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const initializeDatabase = require('./models/provisiondatabase');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

const port = process.env.PORT || '3000';

(async () => {
  await initializeDatabase();
})();

app.use(express.static(path.join(__dirname, "reactcalendly/build")));

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
    keys: ['randomstringhere'],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(require('./calendlyOauth2Strategy'));
passport.serializeUser((user, next) => {
  next(null, user);
});
passport.deserializeUser((user, next) => {
  next(null, user);
});

// routes
app.use('/oauth', require('./routes/oauth'));
app.use('/api', require('./routes/api'));
app.get('*', function (req,res) {
  res.sendFile(path.join(__dirname, "/reactcalendly/build", "index.html"), err =>{
    console.log("error " + err);
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});


app.listen(port, () => {
  console.log("listening on port " + port)
});
