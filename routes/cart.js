const {Router} = require('express');
const router = Router();

const Course = require('../models/course.js');

router.get('/', async (req, res, next) => {
  const user = await req.user.populate('cart.items.courseId').execPopulate();
  const courses = user.cart.items.map((item) => ({
    ...item.courseId._doc,
    count: item.count,
    id: item.courseId.id,
  }));
  res.render('cart', {
    courses,
    title: 'Cart',
  });
});

router.post('/add', async (req, res, next) => {
  const course = await Course.findById(req.body.id);
  try {
    await req.user.addToCart(course);
  } catch (e) {
    console.log(e);
  }

  return res.redirect('/courses')
});

router.delete('/remove/:id', async (req, res, next) => {
  try {
    await req.user.removeFromCart(req.params.id);
    const user = await req.user.populate('cart.items.courseId').execPopulate();
    res.status(200).json({
      courses: user.cart.items.map((item) => ({
        ...item.courseId._doc,
        count: item.count,
        id: item.courseId._id,
      }))
    });
  } catch (e) {
    throw e;
  }
});

module.exports = router;
