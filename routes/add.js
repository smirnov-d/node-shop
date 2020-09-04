const {Router} = require('express');
const router = Router();
const {validationResult} = require('express-validator');
const auth = require('../middleware/auth');
const {courseValidators} = require('../utils/validators');

const Course = require('../models/course.js');

router.route('/')
  .get(auth, (req, res, next) => {
    res.render('add', {
      title: 'Add course',
      data: {
        title: '',
        price: 0,
        url: '',
      }
    });
  })
  .post(auth, courseValidators, async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('error', errors.array().map(({msg}) => msg));
      return res.status(422).render('add', {
        title: 'Add course',
        data: {
          title: req.body.title,
          price: req.body.price,
          url: req.body.url,
        }
      });
    }

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
