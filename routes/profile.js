const {Router} = require('express');
const router = Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const fileMiddleware = require('../middleware/fileUpload');
// const fileUpload = require('../middleware/fileUpload');

router.get('/', auth, async (req, res, next) => {
  const user = req.user.toObject();
  res.render('profile', {
    user,
  })
});

router.post('/', fileMiddleware.single('avatar'), auth, async (req, res, next) => {
  try {
    console.log('req.file', req.file);
    const user = await User.findById(req.user._id);
    console.log('user', user);
    user.name = req.body.name;
    if (req.file) {
      user.avatar = req.file.path;
    }
    await user.save();
    res.redirect('/profile');
  } catch (err) {
    throw err;
  }
});

module.exports = router;
