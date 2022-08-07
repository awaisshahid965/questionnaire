const User = require("../models/User");
const bcrypt = require('bcrypt');

// SIGNUP GET
module.exports.signup_get = (req, res) => {
  const { isLoggedIn, user_name } = req.session.user;
  res.render('signup', { isLoggedIn, user_name });
}

// SIGNUP POST
module.exports.signup_post = async (req, res) => {
  const { isLoggedIn, user_name } = req.session.user;
  const { uname, email, password } = req.body;
  const regex = new RegExp("^[a-zA-Z0-9._]{5,30}@[a-zA-Z]{3,10}\.[a-zA-Z]{2,10}$");
  let error = { name: '', email: '', password: '' };

  // Field Error Handeling
  if (!regex.test(email)) error.email = "Email Format Incorrect ( Must include @ )";
  if (uname.length < 3) error.name = "Username length must greater than 3 ( like Joe )";
  if (password.length < 5) error.password = "Password length must greater than 5";

  if (error.name === '' && error.email === '' && error.password === '') {
    // here
    const isExist = await User.exists({ email });
    if (isExist) {
      return res.render('signup', { isLoggedIn, user_name, hasUser: "User already Exists..", uname, email });
    }
    const user = new User({ uname, email, password });
    user.save()
        .then(user => {
          req.session.user = {
            id: user._id,
            user_name: user.uname,
            isLoggedIn: true
          };
          res.redirect('/');
        })
        .catch(err => {
          res.render('error', { isLoggedIn, user_name, error_code: "500", error_msg: "Query Error, Either from Database or Incorrect Query Parameters." });
        });
  } else {
    res.render('signup', { isLoggedIn, user_name, error, uname, email });
  }
}

// LOGIN GET
module.exports.login_get = (req, res) => {
  const { isLoggedIn, user_name } = req.session.user;
  res.render('login', { isLoggedIn, user_name });
}

// LOGIN POST
module.exports.login_post = async (req, res) => {
  const { isLoggedIn, user_name } = req.session.user;
  const { email, password } = req.body;
  const regex = new RegExp("^[a-zA-Z0-9._]{5,30}@[a-zA-Z]{3,10}\.[a-zA-Z]{2,10}$");
  let error = { email: '', password: '' };

  // Field Error Handeling
  if (!regex.test(email)) error.email = "Email Format Incorrect ( Must include @ )";
  if (password.length < 5) error.password = "Password length must greater than 5";

  if (error.email === '' && error.password === '') {
    try {
      const user = await User.findOne({ email });
      if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
          req.session.user = {
            id: user._id,
            user_name: user.uname,
            isLoggedIn: true
          };
          res.redirect('/');
        } else {
          error.password = "Incorrect Password!";
          res.render('login', { isLoggedIn, user_name, error, email });
        }
      } else {
        error.email = "Incorrect Email!";
        res.render('login', { isLoggedIn, user_name, error, email });
      }
    } catch (err) {
      res.render('error', { isLoggedIn, user_name, error_code: "500", error_msg: "Query Error, Either from Database or Incorrect Query Parameters." });
    }
  } else {
    res.render('login', { isLoggedIn, user_name, error, email });
  }
}

// LOGOUT GET
module.exports.logout_get = (req, res) => {
  req.session.user = {
    id: '',
    user_name: '',
    isLoggedIn: false
  };
  res.redirect('/');
}
