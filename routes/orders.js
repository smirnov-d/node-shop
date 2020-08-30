const {Router} = require('express');
const router = Router();
const Orders = require('../models/orders');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res, next) => {
  // get the last user's order. the "orders" table doesn't clear after order.
  const orders = await Orders.findOne({userId: req.user.id}).sort({date: 'desc'}).populate('userId').populate('courses.courseId');

  const courses = orders.courses.map((item) => ({
    ...item.courseId._doc,
    count: item.count,
    id: item.courseId._id,
  }));

  res.render('orders', {
    title: 'Order',
    user: {
      ...orders.userId._doc,
    },
    courses: courses,
  });
});

router.post('/', auth, async (req, res, next) => {
  const order = new Orders({
    userId: req.user.id,
    courses: req.user.cart.items,
  })
  await order.save();
  req.user.clearCart();
  res.redirect('/orders');
});

module.exports = router;
