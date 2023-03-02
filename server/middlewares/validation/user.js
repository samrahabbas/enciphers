const {check, validationResult} = require('express-validator');

exports.validateUserSignup = [
  check('username')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Username is Empty')
    .isString()
    .withMessage('Must be a valid name!')
    .isLength({min: 3, max: 20})
    .withMessage('Name must be within 3 to 20 characters!'),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is Empty!')
    .isLength({min: 8, max: 20})
    .withMessage('Password must be within 8 to 20 characters long!'),
  check('confirmPassword')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Confirm Password is Empty!')
    .custom((value, {req}) => {
      if (value !== req.body.password)
        throw new Error('Both password must be the same!');
      return true;
    }),
];

exports.userValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({success: false, message: error});
};

exports.validateUserSignIn = [
  check('username').trim().not().isEmpty().withMessage('Username is Empty!'),
  // .isString()
  // .withMessage('Must be a valid name!')
  // .isLength({min: 3, max: 20})
  // .withMessage('Name must be within 3 to 20 characters!'),
  check('password').trim().not().isEmpty().withMessage('Password is Empty!'),
  // .isLength({min: 8, max: 20})
  // .withMessage('Password must be within 8 to 20 characters long!'),
];
