const { Router } = require('express')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const router = new Router()
const User = require('../models/user')
const mailer = require('../mail')

router.route('/login')
  .get(async (req, res, next) => {
    res.render('auth/login', {
      title: 'Login',
      layout: 'layouts/empty',
    })
  })
  .post(async (req, res, next) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = user
      req.session.isAuth = true
      req.session.save((err) => {
        if (err) {
          throw err
        }
        res.redirect('/')
      })
    } else {
      return res.redirect('/auth/login')
    }
  });

router.post('/register', async (req, res, next) => {
  const name = req.body.name
  const email = req.body['reg-email']
  const password = req.body['reg-password']
  const confirm = req.body['reg-password-confirm']

  const isExist = !!await User.findOne({ email })

  if (isExist || password !== confirm) {
    return res.redirect('/auth/login')
  }

  const user = new User({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    cart: {
      items: []
    },
  })

  await user.save()

  return res.redirect('/')
})

router.get('/logout', (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/auth/login')
  })
})

router.route('/reset')
  .get(async (req, res, next) => {
    res.render('auth/reset', {
      title: 'Reset password',
    })
  })
  .post(async (req, res, next) => {
    try {
      crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
          throw err
        }

        const token = buffer.toString('hex')

        const user = await User.findOne({ email: req.body.email })

        if (user) {
          const expTime = 60 * 60 * 1000 // 1 hour ms
          user.resetToken = token
          user.resetTokenExp = Date.now() + expTime
          await user.save()
          const url = `${process.env.BASE_URL}:${process.env.PORT}/auth/password/${token}`
          await mailer({
            html: `
                <h3>reset password</h3>
                <p>for change password please go <a href="${url}">here</a></p>
            `,
            to: user.email,
            subject: 'Reset password',
          }).catch(console.error)
          return res.redirect('/auth/login')
        }
        return res.redirect('/auth/login#no-user')
      })
    } catch (e) {
      throw e
    }
  });

router.get('/password/:token', async (req, res, next) => {
  if (!req.params.token) {
    return res.redirect('/auth/login')
  }

  try {
    const resetToken = req.params.token

    const user = await User.findOne({
      resetToken,
      resetTokenExp: { $gt: Date.now() }
    })

    if (user) {
      return res.render('auth/password', {
        title: 'New password',
        userId: user._id.toString(),
        token: req.params.token,
      })
    }

    return res.redirect('/auth/login#no-user')

  } catch (err) {
    throw err
  }
})

router.post('/password', async (req, res, next) => {
  const { userId, token, password, confirm } = req.body

  if (password !== confirm) {
    res.redirect('/auth/login');
  }

  try {
    const user = await User.findOne({
      _id: userId,
      resetToken: token,
      resetTokenExp: { $gt: Date.now() },
    })

    if (user) {
      user.password = await bcrypt.hash(password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save()
      return res.redirect('/auth/login')
    }

    return res.redirect('/auth/login#error')

  } catch (err) {
    throw err
  }
})

module.exports = router
