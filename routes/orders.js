const {Router} = require('express');
const router = Router();
const Orders = require('../models/orders');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res, next) => {
  const orders = await Orders.findOne({userId: req.user.id}).populate('userId').populate('courses.courseId');
  res.render('orders', {
    title: 'Order',
    user: {
      ...orders.userId._doc,
    },
    courses: orders.courses.map((item) => ({
      ...item.courseId._doc,
      count: item.count,
      id: item.courseId._id,
    })),
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
