const {Router} = require('express');
const bcrypt = require('bcrypt');
const router = new Router();
const User = require('../models/user');

router.get('/login', async (req, res, next) => {
  res.render('auth/login');
})

router.post('/login', async (req, res, next) => {
  const {email, password} = req.body;

  const user = await User.findOne({email});

  if (user && await bcrypt.compare(password, user.password)) {
    // const userId = '5f2ec06534a93e1568dbfef3';
    req.session.user = user;
    req.session.isAuth = true;
    req.session.save((err) => {
      if (err) {
        throw err;
      }
      res.redirect('/');
    })
  } else {
    return res.redirect('/auth/login');
  }
})

router.post('/register', async (req, res, next) => {
  // req.session.isAuthentificated = true;
  const name = req.body.name;
  const email = req.body['reg-email'];
  const password = req.body['reg-password'];
  const confirm = req.body['reg-password-confirm'];

  const isExist = !!await User.findOne({email})

  if (isExist || password !== confirm) {
    return res.redirect('/auth/login');
  }

  const user = new User({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    cart: {
      items:[]
    },
  });
  console.log('user', user);

  await user.save();

  return res.redirect('/');
})

router.get('/logout', async (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  })
})

module.exports = router;
