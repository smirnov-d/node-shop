module.exports = function (req, res, next) {
  // console.log('token', );
  res.locals.isAuth = req.session.isAuthentificated;
  res.locals.csrf = req.csrfToken();
  next();
}
