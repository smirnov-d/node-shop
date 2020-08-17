const {Router} = require('express');
const router = Router();

const Course = require('../models/course.js');
const Cart = require('../models/cart.js');

router.get('/', async (req, res, next) => {
  const user = await req.user.populate('cart.items.courseId').execPopulate();
  const courses = user.cart.items.map((item) => ({
    ...item.courseId._doc,
    count: item.count,
    id: item.courseId.id,
  }));
  console.log('courses', courses);
  res.render('cart', {courses});
});

router.post('/add', async (req, res, next) => {
  // console.log(req.body);
  const course = await Course.findById(req.body.id);
  // console.log(course)
  try {
    await req.user.addToCart(course);
  } catch (e) {
    console.log(e);
    // throw e;
  }

  return res.redirect('/courses')
  // res.sendFile();
});

router.delete('/remove/:id', async (req, res, next) => {
  try {
    await req.user.removeFromCart(req.params.id);
    const user = await req.user.populate('cart.items.courseId').execPopulate();
    // console.log('user', user.cart.items);
    res.status(200).json({
      courses: user.cart.items.map((item) => ({
        ...item.courseId._doc,
        count: item.count,
        id: item.courseId._id,
      }))
    });
    // const cart = await Cart.remove(req.params.id);
    // res.status(200).json(cart);
  } catch (e) {
    throw e;
  }
});

module.exports = router;
