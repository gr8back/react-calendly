require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const initializeDatabase = require('./models/provisiondatabase');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
var User = require('./models/provisiondatabase');
var sqlite3 = require('sqlite3');
// const cors = require('cors');
// app.use(cors({
//     origin:  ['http://127.0.0.1:3001','http://localhost:3001']
// }));
// var db = new sqlite3.Database('./database/sessions.db', (err) => {
//   if (err) {
//     console.log('Could not connect to database', err)
//   } else {
//     console.log('Connected to database')
//   }
// })



const port = process.env.PORT || '3000';
// const {
//   mockCalendlyAuthentication,
//   mockCalendlyScheduledEvents,
//   mockCalendlyEventTypes,
//   mockCalendlyEvent,
//   mockCalendlyInvitees,
//   mockCalendlyNoShows,
//   mockCalendlyUndoNoShow,
//   mockCalendlyCancelEvent,
// } = require('./utils/test.js');

(async () => {
  await initializeDatabase();
})();

// view engine setup
app.set('views', path.join(__dirname, 'views/handlebars'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.use(express.static(path.join(__dirname, 'public')));
console.log("your dirname " + __dirname)
const reactpath = __dirname + '/views/';
app.use(express.static(reactpath));
app.use(express.static(reactpath + '/static'));
// cookie configuration
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
    keys: ['randomstringhere'],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log("the port being used is " + port)
// passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(require('./calendlyOauth2Strategy'));
passport.serializeUser((user, next) => {
  console.log("serialize user")
  next(null, user);
});
passport.deserializeUser((user, next) => {
    console.log("deserialize user")
  next(null, user);
});

// routes
app.use('/oauth', require('./routes/oauth'));
app.use('/api', require('./routes/api'));
app.get('*', function (req,res) {
  res.sendFile(path.join(__dirname, "public", "index.html"), err =>{
    console.log("error " + err)
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
  console.log("res locals middleware")
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

if (process.env.NODE_ENV === 'test') {
  mockCalendlyAuthentication();
  mockCalendlyEventTypes();
  mockCalendlyScheduledEvents();
  mockCalendlyEvent();
  mockCalendlyInvitees();
  mockCalendlyNoShows();
  mockCalendlyUndoNoShow();
  mockCalendlyCancelEvent();
}

app.listen(port, () => {
  console.log(`Server ready at http://localhost:${port}`);
});
