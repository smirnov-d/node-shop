const {Router} = require('express');
const router = new Router();

router.get('login', async (req, res, next) => {
  res.render('auth/login');
})

module.exports = router;
