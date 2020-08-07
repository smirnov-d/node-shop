const {Router} = require('express');
const router = Router();

router.get('/', (req, res, next) => {
  const people = ['geddy', 'neil', 'alex'];
  res.render('index', {people: people});
  // res.sendFile();
});

module.exports = router;
