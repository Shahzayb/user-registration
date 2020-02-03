const express = require('express');
const controller = require('../controller/user');
const auth = require('../middleware/authenticate');

const router = express.Router();

// register account
router.post('/', controller.postUser);

// login user
router.post('/login', controller.loginUser);

// get my profile
router.get('/me', auth, controller.getMyProfile);

// get all users or search users with pagination
router.get('/', controller.getUser);

// forget password
router.post('/forgot-password', controller.forgotPassword);

// reset password
router.post('/:userId/reset-password', controller.resetPassword);

module.exports = router;
