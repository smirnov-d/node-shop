const {Router} = require('express');
const router = Router();
const Course = require('../models/course');

router.get('/', async (req, res, next) => {
  const courses = await Course.getAll();
  // console.log('courses', courses);
  res.render('courses', {courses});
  // res.sendFile();
});

router.post('/edit', async (req, res, next) => {
  console.log(req.body);
  await Course.update(req.body);
  // console.log('courses', courses);
  res.redirect('/courses');
});

router.get('/:id', async (req, res, next) => {
  const course = await Course.getById(req.params.id);
  // console.log('courses', courses);
  res.render('course', {course});
  // res.sendFile();
});

router.get('/:id/edit', async (req, res, next) => {
  if (!req.query.allow) {
    res.redirect('/');
  }
  const course = await Course.getById(req.params.id);
  res.render('course-edit', {course});
});

module.exports = router;
