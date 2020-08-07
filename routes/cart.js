const {Router} = require('express');
const router = Router();

const Course = require('../models/course.js');
const Cart = require('../models/cart.js');

router.get('/', async (req, res, next) => {
  const cart = await Cart.fetch();
  res.render('cart', {cart});
});

router.post('/add', async (req, res, next) => {
  console.log(req.body);
  const course = await Course.getById(req.body.id);
  console.log(course)
  try {
    await Cart.add(course);
  } catch (e) {
    console.log(e);
    // throw e;
  }

  return res.redirect('/courses')
  // res.sendFile();
});

router.delete('/remove/:id', async (req, res, next) => {
  try {
    const cart = await Cart.remove(req.params.id);
    res.status(200).json(cart);
  } catch (e) {
    throw e;
  }
});

module.exports = router;
