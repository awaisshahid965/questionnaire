require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');


const app = express();


// database connection
mongoose.connect(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(process.env.PORT || 3000))
  .catch((err) => {
    console.log("Database Error!!!");
  });

// middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.HASH,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection, collection: 'sessions' }),
  cookie: { maxAge: 1000 * 3600 * 24, httpOnly: true }
}));


// view engine
app.set('view engine', 'ejs');

// Session Initialization
app.get('*', (req, res, next) => {
  if (typeof req.session.user === "undefined") {
    req.session.user = {
      id: '',
      user_name: '',
      isLoggedIn: false
    };
  }
  next();
});

// routes
app.use(authRoutes);
app.use(userRoutes);
app.get('*', (req, res) => {
  res.redirect('/');
});
