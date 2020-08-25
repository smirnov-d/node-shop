const {Router} = require('express');
const router = Router();

const Course = require('../models/course.js');

router.route('/')
  .get((req, res, next) => {
    res.render('add', {
      title: 'Add course',
    });
  })
  .post(async (req, res, next) => {
    const {title, price, url} = req.body;
    const course = new Course({
      title,
      price,
      url,
      userId: req.user,
    });
    try {
      await course.save();
      res.redirect('/courses')
    } catch (e) {
      console.log(e);
    }
  });

module.exports = router;
