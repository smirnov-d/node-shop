const {Router} = require('express');
const router = Router();

module.exports = function (req, res, next) {
  res.locals.isAuth = req.session.isAuthentificated;
  res.locals.csrf = req.csrfToken();
  res.locals.routes = [
    {
      link: '/',
      label: 'Home',
      isActive: false,
    },
    {
      link: '/courses',
      label: 'Courses',
      isActive: false,
    },
    {
      link: '/cart',
      label: 'Cart',
      isActive: false,
    },
    {
      link: '/auth/login',
      label: 'Login',
      isActive: false,
    },
    {
      link: '/auth/logout',
      label: 'Logout',
      isActive: false,
    },
    {
      link: '/profile',
      label: 'Profile',
      isActive: false,
    },
  ];

  const current = res.locals.routes.find(({link}) => {
    const re = new RegExp("^"+link+"$");
    // return req.originalUrl === '/' ? req.originalUrl === link : req.originalUrl.startsWith(link);
    return req.originalUrl === '/' ? req.originalUrl === link : re.test(req.originalUrl);
  });

  if (current) {
    current.isActive = true;
  }

  next();
}
