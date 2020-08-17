const {Router} = require('express');
const router = Router();
const Orders = require('../models/orders');

router.get('/', async (req, res, next) => {
  const orders = await Orders.findOne({userId: req.user.id}).populate('userId').populate('courses.courseId');
  // console.log(orders);
  res.render('orders', {
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

router.post('/', async (req, res, next) => {
  const order = new Orders({
    userId: req.user.id,
    courses: req.user.cart.items,
  })
  await order.save();

  // console.log(req.body);
  // const {id, ...course} = req.body;
  // await Course.findByIdAndUpdate(id, course);
  // // console.log('courses', courses);
  res.redirect('/orders');
  req.user.clearCart();
});

module.exports = router;
