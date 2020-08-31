const {Router} = require('express');
const router = Router();
const Course = require('../models/course');
const auth = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  const courses = await Course.find();
  res.render('courses', {
    courses,
    title: 'All courses',
    userId: req.user ? req.user._id.toString() : null,
  });
});

router.post('/edit', auth, async (req, res, next) => {
  try {
    const {id, ...data} = req.body;
    let course = await Course.findById(id);

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
    // todo: diff between findByIdAndDelete / findByIdAndRemove ???
    await Course.deleteOne({
      _id: req.body.id,
      userId: req.user._id,
    });
    return res.redirect('/courses');
  } catch(e) {
    throw e;
  }

  return res.redirect('/courses');
});

router.get('/:id', async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  res.render('course', {
    course,
    userId: req.user._id,
    title: course.title,
  });
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
    res.render('course-edit', {
      course,
      title: `Edit ${course.title}`,
    });
  } catch (err) {
    throw err;
  }
});

module.exports = router;
