const {Router} = require('express');
const router = Router();

const Course = require('../models/course.js');

router.get('/', (req, res, next) => {
  const people = ['geddy', 'neil', 'alex'];
  res.render('add', {people: people});
  // res.sendFile();
});

router.post('/', async (req, res, next) => {
  // console.log(req.body);
  // const course = new Course(req.body);
  const {title, price, url} = req.body;
  const course = new Course({
    title,
    price,
    url,
    userId: req.user,
  });
  try {
    await course.save();
    console.log('saved');
    res.redirect('/courses')
  } catch (e) {
    console.log(e);
    // throw e;
  }

  // return res.redirect('/courses')
});

module.exports = router;
