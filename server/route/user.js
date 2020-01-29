const express = require('express');
const controller = require('../controller/user');

const router = express.Router();

// register account
router.post('/', controller.postUser);

// login user
router.post('/login', controller.loginUser);

// get all users or search users with pagination
// router.get('/', controller.getUser);

// forget password
// router.post('/forgot-password', router.forgotPassword);

module.exports = router;