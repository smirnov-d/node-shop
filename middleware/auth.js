module.exports = function (req, res, next) {
  // console.log('auth', req.session);
  if (!req.session.isAuth) {
    return res.redirect('/auth/login');
  }
  next();
}
