const {body} = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
  body('name', 'Name must contain more than 3 symbols').isLength({min: 3}).trim().escape(),
  body('reg-email', 'Incorrect email').isEmail().custom(async(val, {req}) => {
    try {
      if (await User.findOne({email: val})) {
        return Promise.reject('User already exists');
      }
    } catch (err) {
      throw err;
    }
  }).normalizeEmail(),
  body('reg-password', 'Pass must be min 3 / max 20 symbols').isLength({min: 3, max: 20}).isAlphanumeric().withMessage('must be Alphanumeric').trim(),
  // todo: зачем trim()?
  body('reg-password-confirm').custom((val, {req}) => {
    if (val !== req.body['reg-password']) {
      throw new Error('Confirm password');
    }
    return true;
  }).trim(),
];

exports.loginValidators = [
  body('email', 'Incorrect email').isEmail().custom(async(val, {req}) => {
    try {
      const user = await User.findOne({email: val});
      if (!user) {
        return Promise.reject('User was not found');
      }
    } catch (err) {
      throw err;
    }
  }).normalizeEmail(),
  body('password', 'Pass must be min 3 / max 20 symbols').isLength({min: 3, max: 20}).isAlphanumeric().withMessage('must be Alphanumeric').trim(),
];

exports.courseValidators = [
  body('title').isLength({min: 3}).withMessage('Title must be min 3 symbols').trim(),
  body('price').isNumeric().withMessage('Incorrect price'),
  body('url', 'Incorrect Url').isURL()
];
