module.exports.isLogin = (req, res, next) => {
  if (req.session.user.isLoggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports.protectWhenLogin = (req, res, next) => {
  if (req.session.user.isLoggedIn) {
    res.redirect('/');
  } else {
    next();
  }
}
