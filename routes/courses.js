const {Router} = require('express');
const router = Router();
const Course = require('../models/course');
const auth = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  const courses = await Course.find();
  res.render('courses', {courses, userId: req.user ? req.user._id.toString() : null});
  // res.sendFile();
});

router.post('/edit', auth, async (req, res, next) => {
  try {
    const {id, ...data} = req.body;
    let course = await Course.findById(id);
    // await Course.findByIdAndUpdate(id, data);

    if (course?.userId.toString() === req.user._id.toString()) {
      Object.assign(course, data);
      await course.save();
    }

    return res.redirect('/courses');

  } catch (err) {
    throw err;
  }

});

router.post('/remove', auth, async (req, res, next) => {
  try {
    console.log(req.body.id);
    // todo: diff between findByIdAndDelete / findByIdAndRemove ???
    await Course.deleteOne({
      _id: req.body.id,
      userId: req.user._id,
    });
    return res.redirect('/courses');
  } catch(e) {
    throw e;
  }

  // console.log('courses', courses);
  return res.redirect('/courses');
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

  try {
    const course = await Course.findById(req.params.id);

    if(course.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/courses');
    }

    res.render('course-edit', {course});
  } catch (err) {
    throw err;
  }

});

module.exports = router;
