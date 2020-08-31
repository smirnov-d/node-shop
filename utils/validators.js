const {body} = require('express-validator');

exports.registerValidators = [
  body('name', 'Name must contain more than 3 symbols').isLength({min: 3}),
  body('reg-email', 'Incorrect email').isEmail(),
  body('reg-pass', 'Pass must be min 3 / max 20 symbols').isLength({min: 3, max: 20}).isAlphanumeric(),
  body('reg-password-confirm').custom((val, {req}) => {
    if (val !== req.body['reg-password']) {
      throw new Error('Confirm password');
    }
    return true;
  }),
];
