const {Router} = require('express');
const router = Router();
const Course = require('../models/course');
const auth = require('../middleware/auth');
const mailer = require('../mail');

router.get('/', async (req, res, next) => {
  const courses = await Course.find();
  // console.log('courses', courses);


  await mailer("Hello").catch(console.error);
  res.render('courses', {courses});
  // res.sendFile();
});

router.post('/edit', auth, async (req, res, next) => {
  console.log(req.body);
  const {id, ...course} = req.body;
  await Course.findByIdAndUpdate(id, course);
  // console.log('courses', courses);
  res.redirect('/courses');
});

router.post('/remove', auth, async (req, res, next) => {
  // console.log(req.body);
  // console.log(req.query.id);
  try {
    console.log(req.body.id);
    // todo: diff between findByIdAndDelete / findByIdAndRemove ???
    await Course.findByIdAndDelete(req.body.id);
    res.redirect('/courses');
  } catch(e) {
    throw e;
  }

  // console.log('courses', courses);
  res.redirect('/courses');
});

router.get('/:id', async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  // console.log('courses', courses);
  res.render('course', {course});
  // res.sendFile();
});

router.get('/:id/edit', auth, async (req, res, next) => {
  if (!req.query.allow) {
    res.redirect('/');
  }
  const course = await Course.findById(req.params.id);
  res.render('course-edit', {course});
});

module.exports = router;
