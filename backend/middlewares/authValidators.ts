const { check, body } = require('express-validator');


export const loginValidation = [
  body('email').trim().isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const updateUserProfileValidation = [
  check('name')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 255 })
    .withMessage(
      'First name must be a string with maximum length of 255 characters'
    ),
  check("email")
  .optional()
  .isEmail()
  .normalizeEmail()
  .withMessage("Email must be a valid email address"),
];
