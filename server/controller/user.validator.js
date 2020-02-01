const { body, query, param, validationResult } = require('express-validator');
const User = require('../model/user');

const errorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    return next();
  }
};

exports.postUser = [
  [
    body('username')
      .trim()
      .not()
      .isEmpty()
      .withMessage('username should not be empty')
      .customSanitizer(username => username.toLowerCase())
      .custom(username => {
        return User.exists({ username }).then(exist => {
          if (exist) {
            throw new Error();
          }
          return true;
        });
      })
      .withMessage('username already taken, please enter some other username'),
    body('name')
      .trim()
      .not()
      .isEmpty()
      .withMessage('name should not be empty')
      .customSanitizer(name => name.toLowerCase()),
    body('email')
      .trim()
      .not()
      .isEmpty()
      .withMessage('please enter email address')
      .customSanitizer(email => email.toLowerCase())
      .isEmail()
      .withMessage('please enter valid email')
      .custom((email /*, { req }*/) => {
        return User.exists({ email }).then(exist => {
          if (exist) {
            throw new Error();
          }
          return true;
        });
      })
      .withMessage(
        'account with this email already exists. please enter some other email address'
      ),
    body('password')
      .trim()
      .not()
      .isEmpty()
      .withMessage('please enter password')
      .isLength({ min: 8 })
      .withMessage('please enter password with at least 8 character')
  ],
  errorMiddleware
];

exports.loginUser = [
  body('username')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please enter username')
    .customSanitizer(username => username.toLowerCase()),
  body('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('please enter password'),
  errorMiddleware
];

exports.getUser = [
  query('q')
    .trim()
    .customSanitizer(q => q && q.toLowerCase()),
  query('page')
    .trim()
    .not()
    .isEmpty()
    .withMessage('page number is required')
    .toInt()
    .custom(page => {
      if (page < 1) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('page should be a number. and should be greater than 0'),
  query('size')
    .trim()
    .not()
    .isEmpty()
    .withMessage('size number is required')
    .toInt()
    .custom(size => {
      if (size < 1 || size > 100) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('size should be a number and between 1 and 100'),
  errorMiddleware
];

exports.forgotPassword = [
  body('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage('please enter email address')
    .customSanitizer(email => email.toLowerCase())
    .isEmail()
    .withMessage('please enter valid email')
    .custom(email => {
      return User.exists({ email }).then(exist => {
        if (!exist) {
          throw new Error();
        }
        return true;
      });
    })
    .withMessage(
      'account with this email does not exist. please enter some other email address'
    ),

  errorMiddleware
];

exports.resetPassword = [
  param('userId')
    .custom(userId => {
      return User.exists({ _id: userId }).then(exist => {
        if (!exist) {
          throw new Error();
        }
        return true;
      });
    })
    .withMessage(
      'account with this userId does not exist. please enter valid userId'
    ),
  body('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('please enter password')
    .isLength({ min: 8 })
    .withMessage('please enter password with at least 8 character'),
  errorMiddleware
];
