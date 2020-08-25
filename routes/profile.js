const {Router} = require('express');
const router = Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const fileMiddleware = require('../middleware/fileUpload');

router.get('/', auth, async (req, res, next) => {
  const user = req.user.toObject();
  res.render('profile', {
    user,
    title: 'Profile',
  })
});

router.post('/', fileMiddleware.single('avatar'), auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
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
