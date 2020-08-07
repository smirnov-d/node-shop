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
  const course = new Course(req.body);
  try {
    await course.save();
  } catch (e) {
    console.log(e);
    // throw e;
  }

  return res.redirect('/courses')
  // res.sendFile();
});

module.exports = router;
