module.exports = function (req, res, next) {
  res.set('Content-Security-Policy', 'img-src *');

  res.locals.isAuth = req.session.isAuth;
  res.locals.csrf = req.csrfToken();
  res.locals.messages = req.flash();

  const routes = [
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
      isPrivate: true,
    },
    {
      link: '/auth/login',
      label: 'Login',
      isActive: false,
    },
    {
      link: '/profile',
      label: 'Profile',
      isActive: false,
      isPrivate: true,
    },
    {
      link: '/auth/logout',
      label: 'Logout',
      isActive: false,
      isPrivate: true,
    },
  ];

  res.locals.routes = routes.filter(({label, isPrivate}) => {
    return res.locals.isAuth ? label !== 'Login' : !isPrivate;
  });

  const current = res.locals.routes.find(({link}) => {
    const re = new RegExp("^"+link);
    return req.originalUrl === '/' ? req.originalUrl === link : re.test(req.originalUrl) && link !== '/';
  });

  if (current) {
    current.isActive = true;
  }

  next();
}
